const express = require('express');
const fs = require('fs');
const { summarizeNotes } = require('./openai');

const app = express();
app.use(express.json());

const claims = JSON.parse(fs.readFileSync('./mocks/claims.json'));
const notes = JSON.parse(fs.readFileSync('./mocks/notes.json'));

app.get('/claims/:id', (req, res) => {
  const claim = claims[req.params.id];
  if (claim) {
    res.json(claim);
  } else {
    res.status(404).json({ error: 'Claim not found' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/claims/:id/summarize', async (req, res) => {
  const note = notes[req.params.id];

  if (!note) {
    return res.status(404).json({ error: 'Notes not found for claim' });
  }

  try {
    console.log(`Summarizing note for claim ${req.params.id}:`, note);

    const result = await summarizeNotes(note);

    if (!result.summary || result.summary.trim() === "" || result.summary === "No summary generated") {
      console.warn(`No structured summary generated for claim ${req.params.id}`);
      return res.json({
        summary: "No summary available for this note.",
        customerSummary: "",
        adjusterSummary: "",
        nextStep: ""
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Summarization error:", err.message);
    res.status(500).json({ error: 'Failed to summarize notes' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
