// Netlify Serverless Function: send-whatsapp-order.js
// VERSION: Vonage

const { Vonage } = require('@vonage/server-sdk');
const { Text } = require('@vonage/messages');

// --- PASTE YOUR CREDENTIALS FROM THE VONAGE API DASHBOARD HERE ---
const apiKey = '409a7451';         // <-- PASTE YOUR API KEY
const apiSecret = 'I88oXZHKe3CnD1is';   // <-- PASTE YOUR API SECRET

// This is the WhatsApp number provided by the Vonage Sandbox
const vonageSandboxNumber = '14157386102'; // e.g., '14157386170'

// Initialize the Vonage client
const vonage = new Vonage({
  apiKey: apiKey,
  apiSecret: apiSecret,
});

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the shop's phone number and the message from the request body
    const { shopPhone, shopMessage } = JSON.parse(event.body);

    // Send the message using the Vonage Messages API
    await vonage.messages.send(
      new Text(
        shopMessage,
        shopPhone, // The 'to' number
        vonageSandboxNumber, // The 'from' number provided by Vonage
        'whatsapp'
      )
    );

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order sent via Vonage successfully!' 
      })
    };

  } catch (error) {
    // If any error occurs, log it and return a server error response
    console.error('Error sending Vonage message:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send order via Vonage.' 
      })
    };
  }
};
