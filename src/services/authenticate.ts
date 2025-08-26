import { UsersRepository } from "@/repositories/prisma/users-repo-interface";
import { InvalidCredentials } from "./errors/invalid-credentials";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";


interface AuthenticateUseCaseRequest{
    email: string
    password: string
}
interface AuthenticateUseCaseResponse{
    user: User
}

export class AuthenticateUseCase{

    constructor(private usersRepo: UsersRepository){}

    async handle({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse>{
        const user = await this.usersRepo.findByEmail(email)

        if(!user){ 
            throw new InvalidCredentials()
        }


        const doestPasswordMatches = await compare(password, user.password_hash)

        if(!doestPasswordMatches){ 
            throw new InvalidCredentials()
        }


        return {user,}
    }
}