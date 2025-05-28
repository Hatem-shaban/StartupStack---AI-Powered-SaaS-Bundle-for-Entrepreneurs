const stripe = require('stripe')(process.env.sk_test_51Ps2dzE92IbV5FBU7tvVRxNXbIujzrZuWreCa52nCseLpU2JKoimAQYCsGxxZ4kaWqCJpqs5Hp6oOU6JolTio0ok00fsIpRYOj);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { priceId, customerEmail } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel`,
      customer_email: customerEmail,
      metadata: {
        product: 'StartupStack Pro Bundle'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};