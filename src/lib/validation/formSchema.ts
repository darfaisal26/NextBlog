import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(File, { message: "Image must be a file" }),
});

export const blogSchemaWithoutImage = blogSchema.omit({ image: true });
