import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../prisma/users-repo-interface";

export class inMemoryRepository implements UsersRepository {
  public items: User[] = [];
  
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "user-1",
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      createdf_at: new Date(),
    };


    this.items.push(user)

    return user
  }

  async findByEmail(email: string) {
   const userEmail = this.items.find((item) => item.email === email)
   
   if(!userEmail){
    return null
   } 
   return userEmail
  }
}
