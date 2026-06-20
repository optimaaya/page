export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const formData = await request.formData();
    
    // Get form fields
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const company = formData.get('company') || '';
    const service = formData.get('service') || '';
    const budget = formData.get('budget') || '';
    const message = formData.get('message') || '';
    
    // You c const emailResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/email/routing/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalization: {
          to: [{ email: 'optimaaya@gmail.com' }]
        },
        from: { email: 'contact@yourdomain.com' },
        subject: `New Contact Form Submission from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent
          }
        ]
      })
    });
    
    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }an add email sending logic here if needed
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Thanks! We'll get back to you within 24 hours." 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Something went wrong. Please try again." 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}