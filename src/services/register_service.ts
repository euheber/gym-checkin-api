import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {

  constructor(private userRepository:any) {}

  async handle({ name, email, password }: RegisterUserRequest) {
    const hash_password = await hash(password, 6);
    const checkUserEmailAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (checkUserEmailAlreadyExists) {
      throw new Error("Email already exists");
    }

    // const prismaUserRepository = new PrismaUserRepository();

    await this.userRepository.create({
      name,
      email,
      password_hash: hash_password,
    });
  }
}
