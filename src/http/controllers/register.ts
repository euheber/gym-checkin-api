import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/userAlreadyExists";
import { RegisterUseCase } from "@/services/register_service";
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
    const PrismaUsersRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(PrismaUsersRepository)
    await registerUseCase.handle({ name, email, password });

    
  } catch (err) {
    if(err instanceof UserAlreadyExistsError){ 
      return reply.status(409).send({message: err.message})
    }

    throw err

  }

  return reply.status(201).send();
};
