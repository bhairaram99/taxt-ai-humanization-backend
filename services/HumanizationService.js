// services/HumanizationService.js
import OpenAI from "openai";
import { MAX_TEXT_LENGTH } from "../configs/constants.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_RETRIES = 3;

function fallbackHumanization(text) {
    let result = text.replace(/\s+/g, " ").trim();
    return result.length > MAX_TEXT_LENGTH ? result.substring(0, MAX_TEXT_LENGTH).trim() : result;
}

function injectHumanPatterns(text) {
    let result = text;
    
    // Apply contractions
    const replacements = [
        [/\bis not\b/gi, "isnt"],
        [/\bwill not\b/gi, "wont"],
        [/\bcan not\b/gi, "cant"],
        [/\bdo not\b/gi, "dont"],
        [/\bdid not\b/gi, "didnt"],
        [/\bdoes not\b/gi, "doesnt"],
        [/\bhave not\b/gi, "havent"],
        [/\bhas not\b/gi, "hasnt"],
        [/\bwould not\b/gi, "wouldnt"],
        [/\bcould not\b/gi, "couldnt"],
        [/\bshould not\b/gi, "shouldnt"],
        [/\bwould have\b/gi, "wouldve"],
        [/\bcould have\b/gi, "couldve"],
        [/\bshould have\b/gi, "shouldve"],
        [/\bit is\b/gi, "its"],
        [/\bthere is\b/gi, "theres"],
        [/\bi am\b/gi, "im"],
        [/\byou are\b/gi, "youre"],
        [/\bwe are\b/gi, "were"],
        [/\bthey are\b/gi, "theyre"],
        [/\bi will\b/gi, "ill"],
        [/\byou will\b/gi, "youll"],
        [/\bi have\b/gi, "ive"],
        [/\byou have\b/gi, "youve"],
        [/\blet us\b/gi, "lets"],
    ];
    
    replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
    });

    // Add colloquial markers
    const sentences = result.split(/(?<=[.!?])\s+/).filter(s => s.trim());
    const markers = ["honestly, ", "look, ", "i mean, ", "you know, ", "like, ", "basically, ", "actually, "];
    
    for (let i = 0; i < sentences.length; i++) {
        if (!sentences[i].match(/^(honestly|look|i mean|you know)/i) && Math.random() > 0.6) {
            sentences[i] = markers[Math.floor(Math.random() * markers.length)] + sentences[i].charAt(0).toLowerCase() + sentences[i].slice(1);
        }
    }
    result = sentences.join(" ");

    // Break long sentences
    const lines = result.split(/\. /).filter(s => s.trim());
    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].trim().split(/\s+/);
        if (words.length > 20) {
            let idx = Math.floor(words.length / 2);
            for (let j = idx - 2; j < idx + 3; j++) {
                if (['and', 'but', 'because'].includes(words[j]?.toLowerCase())) {
                    idx = j;
                    break;
                }
            }
            if (idx > 5 && idx < words.length - 5) {
                const p1 = words.slice(0, idx).join(' ');
                const p2 = words.slice(idx + 1).join(' ');
                lines[i] = p1 + '. ' + p2.charAt(0).toUpperCase() + p2.slice(1);
            }
        }
    }
    result = lines.join('. ');

    // Remove AI phrases
    const aiPhrases = [
        [/\bit is important to note\b/gi, ""],
        [/\bin conclusion\b/gi, "so"],
        [/\bat the end of the day\b/gi, "at the end"],
        [/\bfurthermore\b/gi, "plus"],
    ];
    aiPhrases.forEach(([p, r]) => { result = result.replace(p, r); });

    result = result.replace(/^([a-z])/gm, m => m.toUpperCase());
    return result.replace(/\s+/g, ' ').trim();
}

async function generateContent(prompt, temp, topP) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await client.chat.completions.create({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: temp,
                top_p: topP,
            });
            let text = response?.choices?.[0]?.message?.content?.trim() || "";
            return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
        } catch (error) {
            if (attempt === MAX_RETRIES - 1) {
                return fallbackHumanization(prompt.substring(0, 300));
            }
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
    }
    return "";
}

async function multiPassHumanization(params) {
    const { text } = params;
    if (!text || typeof text !== "string") return "";

    let input = text.substring(0, MAX_TEXT_LENGTH);
    console.log("Starting AI bypass humanization...");

    const p1Prompt = `Rewrite this to be 100% human-like, undetectable by AI detectors. Use tons of contractions, casual markers (honestly, look, i mean, you know, like), short punchy sentences mixed with longer ones, casual vocabulary, remove AI phrases. Sound like talking to a friend. Original: "${input}" Rewrite only:`;
    let p1 = await generateContent(p1Prompt, 0.5, 0.75);
    p1 = injectHumanPatterns(p1);

    const p2Prompt = `Make this even more human. Add more contractions, more casual markers, shorter varied sentences. Text: "${p1}" Output only:`;
    let p2 = await generateContent(p2Prompt, 0.55, 0.78);
    p2 = injectHumanPatterns(p2);

    const p3Prompt = `Final polish - keep super casual. Text: "${p2}" Output only:`;
    let final = await generateContent(p3Prompt, 0.5, 0.72);
    return injectHumanPatterns(final);
}

export async function humanizeText(params) {
    if (!params || typeof params !== "object") return "";
    const { text, deepHumanization = true } = params;
    if (!process.env.OPENAI_API_KEY) return fallbackHumanization(text || "");

    try {
        if (deepHumanization) {
            return await multiPassHumanization(params);
        }
        let result = await generateContent(`Rewrite to sound human. Use tons of contractions, casual language. Text: "${text}" Output only:`, 0.5, 0.75);
        return injectHumanPatterns(result);
    } catch (error) {
        return fallbackHumanization(text || "");
    }
}
