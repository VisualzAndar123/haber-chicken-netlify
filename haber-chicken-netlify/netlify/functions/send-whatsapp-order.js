// Netlify Serverless Function: send-whatsapp-order.js
// VERSION 3: HARDCODED FOR TESTING

const axios = require('axios');

// --- HARDCODED API KEY FOR TESTING ---
// Replace "YOUR_API_KEY_HERE" with your actual CallMeBot API Key.
const API_KEY = "2452142"; 

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { shopPhone, shopMessage } = JSON.parse(event.body);

    if (!API_KEY || API_KEY === "2452142") {
       throw new Error("API Key is not set in the code.");
    }

    const encodedShopMessage = encodeURIComponent(shopMessage);
    const shopApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${shopPhone}&text=${encodedShopMessage}&apikey=${API_KEY}`;
    
    console.log("Sending message to shop with hardcoded key...");
    await axios.get(shopApiUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'WhatsApp message sent to shop successfully!' })
    };

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to send WhatsApp message.' })
    };
  }
};
