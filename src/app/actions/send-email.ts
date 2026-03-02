
'use server';

import { Resend } from 'resend';
import * as z from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function sendEmail(formData: unknown) {
  const parsedData = contactFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, error: 'Invalid form data.' };
  }

  const { email, subject, message } = parsedData.data;

  try {
    const data = await resend.emails.send({
      from: 'Raj Raunak Kumar Website Contact <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Replace with your email
      subject: `New Message from ${email}: ${subject}`,
      html: `<p>You have received a new message from your research website contact form.</p>
             <p><strong>From:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
