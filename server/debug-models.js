require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

async function debugModels() {
    console.log("🔍 Checking available Gemini models for your API Key...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY is missing in .env file.");
        return;
    }

    try {
        // Initialize the client
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Fetch the list
        const response = await ai.models.list();

        // The SDK response structure for list() usually contains a 'models' array or is iterable
        const models = response.models || response;

        console.log("\n✅ SUCCESS! Here are the models you can use:\n");

        let foundFlash = false;

        // Iterate and print
        // Note: The response object format depends on exact SDK version, 
        // handling standard array or paginated response.
        if (Array.isArray(models)) {
            models.forEach(model => {
                // We only care about models that can 'generateContent'
                if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`👉 Name: ${model.name}`);
                    console.log(`   Display: ${model.displayName}`);
                    console.log(`   Version: ${model.version}`);
                    console.log("------------------------------------------------");

                    if (model.name.includes("flash")) foundFlash = true;
                }
            });
        } else {
            // Fallback logging if structure is different
            console.log(JSON.stringify(models, null, 2));
        }

        if (foundFlash) {
            console.log("\n🎉 GOOD NEWS: A 'Flash' model is available. Use the exact 'Name' listed above in your index.js.");
        } else {
            console.log("\n⚠️ WARNING: No 'Flash' model found. You might need to use 'gemini-pro' or check your region.");
        }

    } catch (error) {
        console.error("\n❌ FAILED to list models.");
        console.error("Error Message:", error.message);
        console.error("\nPossible Causes:");
        console.error("1. API Key is invalid.");
        console.error("2. Your Google Cloud Project does not have the Generative Language API enabled.");
        console.error("3. Your IP address/Region is blocked (VPN might help).");
    }
}

debugModels();