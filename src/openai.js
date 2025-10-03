const axios = require('axios');

try {
  require('dotenv').config();
} catch (_) { }

async function summarizeNotes(noteText) {
  const endpoint = process.env.OPENAI_ENDPOINT;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error("Missing OPENAI_ENDPOINT or OPENAI_API_KEY in environment variables.");
  }

  try {
    const response = await axios.post(
      `${endpoint}/openai/deployments/gpt-5-mini/chat/completions?api-version=2025-04-01-preview`,
      {

        messages: [
          {
            role: "system",
            content: `You are an assistant that summarizes claim notes into structured JSON.
          Rules:
          1. Output ONLY valid JSON. No extra text.
          2. Use this exact structure:
          {
            "summary": "<overall summary in one sentence>",
            "customerSummary": "<customer-friendly summary>",
            "adjusterSummary": "<adjuster-focused summary>",
            "nextStep": "<next action>"
          }
          3. If info is missing, leave the value empty.
          Now summarize the following claim note:`
          },
          { role: "user", content: noteText }
        ]
        ,
        max_completion_tokens: 1024
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OpenAI raw response:", JSON.stringify(response.data, null, 2));


    //const rawText = response.data.choices?.[0]?.message?.content?.[0]?.text || "";
    const rawText = response.data.choices?.[0]?.message?.content || "";
    console.log("Model raw text:", rawText);
    
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.warn("Failed to parse JSON. Returning raw text as summary.");
      parsed = {
        summary: rawText || "No summary generated",
        customerSummary: "",
        adjusterSummary: "",
        nextStep: ""
      };
    }
    return parsed;
  } catch (error) {
    console.error("OpenAI API error:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error("Failed to summarize notes");
  }
}

module.exports = { summarizeNotes };
