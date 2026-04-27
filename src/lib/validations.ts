import { z } from "zod";

export const productInputSchema = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name too long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description too long"),
  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature required")
    .max(10, "Maximum 10 features"),
  targetAudience: z
    .string()
    .min(10, "Target audience must be at least 10 characters")
    .max(500, "Target audience too long"),
  price: z.string().min(1, "Price is required").max(100, "Price too long"),
  uniqueSellingPoints: z
    .array(z.string().min(1, "USP cannot be empty"))
    .min(1, "At least one USP required")
    .max(5, "Maximum 5 unique selling points"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const salesPageOutputSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  description: z.string().min(1),
  benefits: z.array(z.string()),
  features: z.array(z.string()),
  socialProof: z.string(),
  pricing: z.string(),
  cta: z.string(),
  painPoints: z.array(z.string()).optional(),
  guarantee: z.string().optional(),
});

export type ProductInputSchema = z.infer<typeof productInputSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SalesPageOutputSchema = z.infer<typeof salesPageOutputSchema>;
