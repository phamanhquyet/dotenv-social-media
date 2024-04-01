import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Tên quá ngắn" }),
  username: z
    .string()
    .min(2, { message: "Tên đăng nhập quá ngắn" })
    .max(50, { message: "Tên đăng nhập tối đa 50 kí tự" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Mật khẩu cần dài ít nhất 8 ký tự" }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Mật khẩu cần dài ít nhất 8 ký tự" }),
});

export const PostValidation = z.object({
  title: z.string().min(5).max(255),
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
