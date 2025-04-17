const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// ✅ CORS with custom config
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await axios.post(
            'https://api.cohere.ai/v1/generate',
            {
                model: 'command-r-plus',
                prompt: userMessage,
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ reply: response.data.generations[0].text });
    } catch (error) {
        console.error('Error from Cohere API:', error.response?.data || error.message);
        res.status(500).send('Something went wrong');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
