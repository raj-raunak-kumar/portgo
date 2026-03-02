'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function submitContactForm(values: z.infer<typeof formSchema>) {
  try {
    await addDoc(collection(db, "messages"), {
      ...values,
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    // Also send an email notification via Formspree
    try {
      await fetch('https://formspree.io/f/xkgdkqrr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(values),
      });
    } catch (emailError) {
      console.error("Failed to forward email via Formspree:", emailError);
      // Don't fail the main submission if just the email alert fails
    }

    return { success: true, message: "Transmission successfully recorded in Krythos central." };
  } catch (error: any) {
    console.error("Form submission error:", error);
    return { success: false, message: "A network anomaly occurred. Failed to sync transmission." };
  }
}
