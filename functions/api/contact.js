export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    // Get form data from the request
    const formData = await request.formData();
    
    // Extract all fields from the form
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const company = formData.get('company') || 'Not provided';
    const service = formData.get('service') || 'Not provided';
    const budget = formData.get('budget') || 'Not provided';
    const message = formData.get('message') || 'No message provided';
    
    // Log the submission (this will show in Cloudflare logs)
    console.log('Form submission received:', { name, email, company, service, budget, message });
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Thanks! We'll get back to you within 24 hours." 
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Something went wrong. Please try again or email us directly at optimaaya@gmail.com" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}