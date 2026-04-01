"use server";

import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/uploads";
import { careerApplicationSchema, contactFormSchema } from "@/schemas/public";

export type ActionResult = {
  success: boolean;
  message: string;
};

const defaultResult: ActionResult = {
  success: false,
  message: "",
};

export async function submitContactMessage(
  _prevState: ActionResult = defaultResult,
  formData: FormData,
): Promise<ActionResult> {
  void _prevState;
  const parsed = contactFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Não foi possível enviar sua mensagem.",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: parsed.data,
    });

    return {
      success: true,
      message: "Mensagem enviada com sucesso. Nossa equipe retornará em breve.",
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível enviar agora. Tente novamente em instantes.",
    };
  }
}

export async function submitCareerApplication(
  _prevState: ActionResult = defaultResult,
  formData: FormData,
): Promise<ActionResult> {
  void _prevState;
  const resume = formData.get("resume");

  const parsed = careerApplicationSchema.safeParse({
    jobId: formData.get("jobId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Confira os campos do formulário.",
    };
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return {
      success: false,
      message: "Anexe um currículo em PDF ou DOC.",
    };
  }

  try {
    const resumeUrl = await uploadFile(resume, "document");

    await prisma.careerApplication.create({
      data: {
        ...parsed.data,
        resumeUrl,
      },
    });

    return {
      success: true,
      message: "Currículo enviado com sucesso. Obrigado pelo interesse.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar seu currículo agora.",
    };
  }
}
