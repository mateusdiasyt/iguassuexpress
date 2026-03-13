import { parseISO } from "date-fns";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Informe sua senha."),
});

export const reservationSearchSchema = z
  .object({
    checkIn: z.string().min(1, "Informe a data de entrada."),
    checkOut: z.string().min(1, "Informe a data de saida."),
    rooms: z.coerce.number().int().min(1).max(9),
    adults: z.coerce.number().int().min(1).max(9),
    children: z.coerce.number().int().min(0).max(6),
    childAges: z.array(z.coerce.number().int().min(0).max(17)).default([]),
  })
  .superRefine((value, ctx) => {
    const checkIn = parseISO(value.checkIn);
    const checkOut = parseISO(value.checkOut);

    if (Number.isNaN(checkIn.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Data de entrada invalida.",
      });
    }

    if (Number.isNaN(checkOut.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Data de saida invalida.",
      });
    }

    if (!Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime())) {
      if (checkOut <= checkIn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["checkOut"],
          message: "A data de saida deve ser maior que a data de entrada.",
        });
      }
    }

    if (value.childAges.length > value.children) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childAges"],
        message: "Quantidade de idades maior que o numero de criancas.",
      });
    }
  });

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  phone: z.string().optional(),
  email: z.string().email("Informe um e-mail valido."),
  message: z.string().min(10, "Escreva uma mensagem um pouco mais detalhada."),
});

export const careerApplicationSchema = z.object({
  jobId: z.string().optional(),
  name: z.string().min(2, "Informe seu nome."),
  phone: z.string().min(8, "Informe um telefone valido."),
  email: z.string().email("Informe um e-mail valido."),
  message: z.string().min(10, "Escreva uma mensagem breve."),
});
