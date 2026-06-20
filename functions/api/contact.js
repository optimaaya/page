export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    let data;
    try {
      data = await request.json();
    } catch {
      const formData = await request.formData();
      data = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        company: formData.get('company') || 'Not provided',
        service: formData.get('service') || 'Not provided',
        budget: formData.get('budget') || 'Not provided',
        message: formData.get('message') || 'No message provided'
      };
    }
    
    const { name, email, company, service, budget, message } = data;
    
    console.log('📩 Form submission received:', { name, email, company, service, budget, message });
    
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
    console.error('❌ Error:', error);
    
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