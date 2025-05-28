const stripe = require('stripe')('sk_test_51Ps2dzE92IbV5FBU7tvVRxNXbIujzrZuWreCa52nCseLpU2JKoimAQYCsGxxZ4kaWqCJpqs5Hp6oU6JolTio0ok00fsIpRYOj');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        const { priceId, customerEmail } = JSON.parse(event.body);
        const siteUrl = 'https://startupstackai.netlify.app'; // Replace with your actual Netlify site URL

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/cancel`,
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