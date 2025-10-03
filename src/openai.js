const axios = require('axios');

async function summarizeNotes(noteText) {
  const endpoint = process.env.OPENAI_ENDPOINT;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post(
    `${endpoint}/openai/responses?api-version=2025-04-01-preview`,
    {
      model: "gpt-5-mini", // specify your deployment name or model
      input: [
        { role: "system", content: "Summarize the following medical note." },
        { role: "user", content: noteText }
      ],
      max_output_tokens: 100,
      temperature: 0.7
    },
    {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.output[0].content[0].text;
}

module.exports = { summarizeNotes };