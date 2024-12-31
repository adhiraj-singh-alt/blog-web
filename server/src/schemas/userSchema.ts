import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  password: z.string().min(6, { message: 'Password must be atleast 6 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const loginSchema = userSchema.omit({ name: true });
