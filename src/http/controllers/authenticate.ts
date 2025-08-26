import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/services/authenticate";
import { InvalidCredentials } from "@/services/errors/invalid-credentials";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {

  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const UserRepo = new PrismaUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(UserRepo)
    
    await authenticateUseCase.handle({email, password})
    
  } catch (err) {

    if(err instanceof InvalidCredentials){ 
      return reply.status(409).send({message: err.message})
    }

    throw err

  }

  return reply.status(200).send();
};
