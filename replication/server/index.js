const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.replicate.com/v1/predictions',
            {
                version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // 모델 버전
                input: { prompt }
            },
            {
                headers: {
                    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const prediction = response.data;
        res.json({ prediction });
    } catch (err) {
        console.error("Replicate API 오류:", err.response?.data || err.message);
        res.status(500).json({ error: 'Image generation failed.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));