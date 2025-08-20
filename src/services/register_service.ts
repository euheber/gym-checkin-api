
import { UsersRepository } from "@/repositories/prisma/users-repo";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/userAlreadyExists";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {

  constructor(private userRepository:UsersRepository) {}

  async handle({ name, email, password }: RegisterUserRequest) {
    const hash_password = await hash(password, 6);
    

    // const prismaUserRepository = new PrismaUserRepository();
    const userEmail =  await this.userRepository.findByEmail(email)

    if(userEmail) throw new UserAlreadyExistsError()
      
    await this.userRepository.create({
      name,
      email,
      password_hash: hash_password,
    });
  }
}
