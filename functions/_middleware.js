import staticFormsPlugin from "@cloudflare/pages-plugin-static-forms";

export const onRequest = staticFormsPlugin({
  respondWith: async ({ formData, name }) => {
    // Get all the form fields
    const name = formData.get("name");
    const email = formData.get("email");
    const company = formData.get("company");
    const service = formData.get("service");
    const budget = formData.get("budget");
    const message = formData.get("message");
    
    // Here you can save to KV, send email, etc.
    // For now, we'll just return a success message
    return new Response(
      JSON.stringify({ message: "Thank you! We'll get back to you soon." }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  },
});