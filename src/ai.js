import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from "@google/generative-ai"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they 
could make with some or all of those ingredients.The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients.
Format your response in markdown to make it easier to render to a web page but don't mention the word "markdown" on your response.
`;

// HF access token
const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            inputs: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
            parameters: {
                max_tokens: 64, // Maximum number of tokens to generate
                temperature: 0.7, // Controls randomness (optional)
                top_p: 0.9, // Nucleus sampling (optional)
            },
        });

        console.log("API Response (Full):", response); // Log full response for debugging

        // Extract and return the generated recipe
        if (response.generated_text) {
            return response.generated_text; // Use the correct field from the response
        } else {
            throw new Error("Unexpected response format"); // Fallback for unexpected formats
        }
    } catch (err) {
        console.error("Error details:", err.message);
        return "Sorry, I couldn't generate a recipe. Please try again.";
    }
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getRecipeFromGemini(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.5, // Controls randomness (0 = deterministic, 1 = creative)
                topP: 0.5, // Nucleus sampling (controls diversity of output)
                topK: 5, // Limits sampling to the top K tokens
                // maxOutputTokens: 100, // Maximum length of the generated response
                // stopSequences: ["\n"], // Sequences that stop generation
            },
        });

        const prompt = `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

        const result = await model.generateContent(prompt);
        const response = result.response;

        console.log("API Response (Full):", response); // Log full response for debugging

        // Extract and return the generated recipe
        if (response.text) {
            return response.text; // Use the correct field from the response
        } else {
            throw new Error("Unexpected response format"); // Fallback for unexpected formats
        }
    } catch (err) {
        console.error("Error details:", err.message);
        return "Sorry, I couldn't generate a recipe. Please try again.";
    }
}
