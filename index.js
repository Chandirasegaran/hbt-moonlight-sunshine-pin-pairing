const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can use any port number you prefer

app.use(bodyParser.json());

app.post('/sendpin', async (req, res) => {
    const pinResponse = req.body;

    if (!pinResponse || !pinResponse.pin) {
        return res.status(400).json({ status: 'error', detail: 'Invalid request body' });
    }

    // URL and credentials
    const url = 'https://sunshine:123@localhost:47990/api/pin';

    // Prepare data
    const data = { pin: pinResponse.pin };

    try {
        const response = await axios.post(url, data, { 
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return res.json({ status: 'success', response: response.data });
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            return res.status(error.response.status).json({ status: 'error', detail: `HTTP error: ${error.response.status}` });
        } else if (error.request) {
            // The request was made but no response was received
            return res.status(400).json({ status: 'error', detail: `Request error: ${error.message}` });
        } else {
            // Something happened in setting up the request that triggered an Error
            return res.status(500).json({ status: 'error', detail: `Internal server error: ${error.message}` });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
