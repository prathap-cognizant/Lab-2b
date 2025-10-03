  const axios = require('axios');

  async function summarizeNotes(noteText) {
    const endpoint = process.env.OPENAI_ENDPOINT;
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(`${endpoint}/openai/deployments/gpt-5-mini/chat/completions?api-version=2025-04-01-preview`, {
      messages: [
        { role: "system", content: "Summarize the following medical note." },
        { role: "user", content: noteText }
      ],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json"
      }
    });

    return response.data.choices[0].message.content;
  }

  module.exports = { summarizeNotes };
