const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  if (!API_KEY) {
    console.log("❌ Error: GEMINI_API_KEY is missing in .env");
    return;
  }

  console.log(`🔑 Testing Key: ${API_KEY.substring(0, 5)}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  console.log("📡 Asking Google for available models...");

  try {
    const response = await axios.get(url);
    const models = response.data.models;
    
    console.log("\n✅ SUCCESS! Your API Key has access to these models:");
    
    let found = false;
    models.forEach(m => {
        // Only show models that can generate text
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`   👉 ${m.name}`); // This is the EXACT name we need
            found = true;
        }
    });

    if (!found) {
        console.log("⚠️ No text-generation models found. You might need to enable the API.");
    }

  } catch (error) {
    console.error("\n❌ FAILED TO LIST MODELS.");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error Message:`, JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 400 || error.response.status === 403) {
          console.log("\n💡 FIX: Go to Google Cloud Console > APIs & Services > Enabled APIs");
          console.log("   and make sure 'Generative Language API' is ENABLED for this project.");
      }
    } else {
      console.error(error.message);
    }
  }
}

listAvailableModels();