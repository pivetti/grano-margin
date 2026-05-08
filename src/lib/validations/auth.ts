import { z } from "zod";

export const registerSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, "Informe pelo menos 2 caracteres.")
      .max(120, "O nome pode ter no maximo 120 caracteres."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Informe um email valido.")
      .max(180, "O email pode ter no maximo 180 caracteres."),
    senha: z
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres.")
      .max(120, "A senha pode ter no maximo 120 caracteres."),
    confirmarSenha: z.string().min(1, "Confirme a senha."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmarSenha"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um email valido.")
    .max(180, "O email pode ter no maximo 180 caracteres."),
  senha: z.string().min(1, "Informe sua senha."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
