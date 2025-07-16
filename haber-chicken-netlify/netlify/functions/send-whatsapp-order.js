// Netlify Serverless Function: send-whatsapp-order.js
// This file will be placed in: /netlify/functions/send-whatsapp-order.js
// VERSION 2: Sends message only to the shop.

// We use 'axios' to make simple web requests to the CallMeBot API.
const axios = require('axios');

// --- IMPORTANT: CallMeBot API KEY ---
// This key must be kept secret on your server.
// When you deploy to Netlify, you will set this as an "Environment Variable".
const API_KEY = process.env.CALLMEBOT_API_KEY;

// The main function that Netlify will run when the endpoint is called.
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the order data sent from the frontend website.
    const { shopPhone, shopMessage } = JSON.parse(event.body);

    // --- THIS SECTION HAS BEEN REMOVED ---
    // No message will be sent to the customer.
    // The logic for constructing and sending the customer message is now gone.
    // --- END OF REMOVED SECTION ---

    // --- Construct the API URL for the SHOP's message ---
    const encodedShopMessage = encodeURIComponent(shopMessage);
    const shopApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${shopPhone}&text=${encodedShopMessage}&apikey=${API_KEY}`;
    
    console.log("Sending message to shop...");
    await axios.get(shopApiUrl);

    // --- Send a success response back to the frontend ---
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'WhatsApp message sent to shop successfully!' })
    };

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    // Let the frontend know something went wrong.
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to send WhatsApp message.' })
    };
  }
};
