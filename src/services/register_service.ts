
import { UsersRepository } from "../repositories/prisma/users-repo-interface";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/userAlreadyExists";
import { User } from "@prisma/client";

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse { 
  user: User
}


export class RegisterUseCase {

  constructor(private userRepository:UsersRepository) {}

  async handle({ name, email, password }: RegisterUserRequest): Promise<RegisterUseCaseResponse>{
    const hash_password = await hash(password, 6);
    

    // const prismaUserRepository = new PrismaUserRepository();
    const userEmail =  await this.userRepository.findByEmail(email)

    if(userEmail){
      
      throw new UserAlreadyExistsError()
    }
      
  const user = await this.userRepository.create({
      name,
      email,
      password_hash: hash_password,
    });


    return { user }
  }
}
