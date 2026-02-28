'use server'

export async function submitContactForm(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    service: formData.get('service') as string,
    message: formData.get('message') as string,
  }

  // TODO: Replace with actual email service / database write
  console.log('Contact form submission:', data)

  return { success: true }
}
