require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
  res.send('AI Code Buddy Backend is running! Use the frontend at http://localhost:5173');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));

app.post('/api/analyze', protect, async (req, res) => {
  const { code, mode, language } = req.body;
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.0-pro",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-exp-02-05"
  ];
  let lastError = null;
  let isRateLimited = false;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      let systemPrompt = `You are an expert AI Programming Coach. A student has provided some code. 
      Your goal is to:
      1. Provide a line-by-line explanation of the code.
      2. Identify any errors or potential bugs and explain why they occur.
      3. Suggest a better logic or a more efficient way to write the code.
      4. Provide a simple example to illustrate the concepts discussed.
      
      Special Instructions:
      - Language: ${language === 'hindi' ? 'Use a mix of Hindi and English (Hinglish) for explanation, keeping technical terms in English.' : 'Use clear and concise English.'}
      - Mode: ${mode === 'simple' ? 'Explain like I am 10 years old. Use analogies, avoid heavy jargon, and be very encouraging.' : 'Provide a detailed technical explanation suitable for a college student.'}
      - Format: Use Markdown for structure. Use bold text for emphasis. Use code blocks for code snippets.
      `;

      const prompt = `${systemPrompt}\n\nHere is the code to analyze:\n\n\`\`\`\n${code}\n\`\`\``;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({ explanation: text, modelUsed: modelName });
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error.message);
      lastError = error;
      
      // Check for rate limit error (429)
      if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota'))) {
        isRateLimited = true;
      }
      
      // Continue to next model
    }
  }

  const errorMessage = isRateLimited 
    ? 'The AI buddy is currently busy (Rate Limit). Please try again in a few seconds.' 
    : 'All AI models failed to process the request. Please check your API key and connection.';

  res.status(500).json({ 
    error: errorMessage,
    details: lastError ? lastError.message : 'Unknown error'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
