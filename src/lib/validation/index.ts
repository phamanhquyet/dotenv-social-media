import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Tên quá ngắn" }),
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8, { message: "Mật khẩu cần dài ít nhất 8 ký tự" }),
});
