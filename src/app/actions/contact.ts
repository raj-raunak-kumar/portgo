
'use server';

import { initializeFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function saveContactMessage(formData: unknown) {
  const validatedData = contactSchema.parse(formData);
  const { firestore } = initializeFirebase();
  
  if (!firestore) {
    throw new Error('Firestore is not initialized.');
  }

  try {
    await addDoc(collection(firestore, 'contacts'), {
      ...validatedData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving contact message to Firestore:', error);
    throw new Error('Could not save message.');
  }
}
