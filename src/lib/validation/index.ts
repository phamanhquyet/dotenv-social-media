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
