// Netlify Serverless Function: send-whatsapp-order.js
const axios = require('axios');

// --- Your actual API KEY from CallMeBot ---
const API_KEY = "2452142";  // Make sure this is correct and registered with your WhatsApp number

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { shopPhone, shopMessage } = JSON.parse(event.body);

    if (!API_KEY) {
       throw new Error("API Key is not set in the code.");
    }

    const encodedShopMessage = encodeURIComponent(shopMessage);
    const shopApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${shopPhone}&text=${encodedShopMessage}&apikey=${API_KEY}`;
    
    console.log("Sending message to shop via CallMeBot API...");
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