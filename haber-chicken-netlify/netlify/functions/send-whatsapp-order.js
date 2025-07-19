// Netlify Serverless Function: send-whatsapp-order.js
// VERSION 4: CORRECTED LOGIC

const axios = require('axios');

// --- HARDCODED API KEY FOR TESTING ---
// This is the API key for the CallMeBot service.
const API_KEY = "2452142"; 

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the shop's phone number and the message from the request body
    const { shopPhone, shopMessage } = JSON.parse(event.body);

    // Encode the message to be safely used in a URL
    const encodedShopMessage = encodeURIComponent(shopMessage);
    
    // Construct the API URL for CallMeBot
    const shopApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${shopPhone}&text=${encodedShopMessage}&apikey=${API_KEY}`;
    
    console.log("Sending WhatsApp message to the shop...");
    
    // Make the GET request to the CallMeBot API
    await axios.get(shopApiUrl);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'WhatsApp message sent to shop successfully!' 
      })
    };

  } catch (error) {
    // If any error occurs, log it and return a server error response
    console.error('Error sending WhatsApp message:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send WhatsApp message.' 
      })
    };
  }
};
