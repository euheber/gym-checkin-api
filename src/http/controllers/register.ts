import { registerUseCase } from "@/services/register_service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {


  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    await registerUseCase({ name, email, password });
  } catch (err) {
    return reply.status(409).send(err);
  }
  return reply.status(201).send();
};
