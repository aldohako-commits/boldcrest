'use server'

export async function submitProjectForm(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    service: formData.get('service') as string,
    budget: formData.get('budget') as string,
    deadline: formData.get('deadline') as string,
    message: formData.get('message') as string,
  }

  // TODO: Replace with actual email service / database write
  console.log('Project form submission:', data)

  return { success: true }
}
