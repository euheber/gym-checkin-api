import { prisma } from "@/lib/prisma";
import { PrismaUserRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({name, email, password}: RegisterUserRequest) {
  const hash_password = await hash(password, 6);
  const checkUserEmailAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (checkUserEmailAlreadyExists) {
    
    throw new Error("Email already exists")
  }

 const prismaUserRepository = new PrismaUserRepository()
 
  await prismaUserRepository.create({name, email, password_hash:hash_password})   
}
