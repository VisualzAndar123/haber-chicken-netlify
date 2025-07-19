// Netlify Serverless Function: send-whatsapp-order.js
// VERSION: Vonage (Corrected with better logging)

const { Vonage } = require('@vonage/server-sdk');

// --- PASTE YOUR CREDENTIALS FROM THE VONAGE API DASHBOARD HERE ---
const apiKey = '409a7451';         // <-- PASTE YOUR API KEY
const apiSecret = 'I88oXZHKe3CnD1is';   // <-- PASTE YOUR API SECRET

// --- IMPORTANT: REPLACE THIS WITH THE NUMBER FROM THE VONAGE SANDBOX ---
// It's the number you send the WhatsApp message TO during setup.
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

    // Send the message using the Vonage Messages API by passing a plain object
    await vonage.messages.send({
      channel: 'whatsapp',
      message_type: 'text',
      text: shopMessage,
      to: shopPhone,
      from: vonageSandboxNumber,
    });

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
    
    // ADDED: Log the detailed error response from Vonage if available
    if (error.response && error.response.data) {
        console.error('Vonage API Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send order via Vonage.' 
      })
    };
  }
};
