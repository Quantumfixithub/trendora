// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // if Node 18+, you can use global fetch and remove this dependency
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET; // set in .env

if (!PAYSTACK_SECRET) {
  console.warn('Warning: PAYSTACK_SECRET not set in .env');
}

app.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ status: 'error', message: 'Missing reference' });

    // Call Paystack verify API
    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ status: 'error', message: 'Paystack verification failed', details: data });
    }

    // Basic checks: verify status is 'success' and amount matches (optional)
    // data.data contains transaction info
    return res.json({ status: 'success', data: data.data });
  } catch (err) {
    console.error('Verify error', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Verify server listening on ${PORT}`));
