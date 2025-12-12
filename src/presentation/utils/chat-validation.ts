import { z } from 'zod';

/**
 * Chat validation schemas
 *
 * These schemas validate user input for the chat feature.
 */

/**
 * Schema for validating chat messages
 */
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message is too long (max 10,000 characters)'),
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
