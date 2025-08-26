import { expect, describe, it } from "vitest";
import { inMemoryRepository } from "../repositories/in-memory-repo/in-memory-users-repo";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentials } from "./errors/invalid-credentials";



describe("Authenticate use case", () => {

  it("Should be able to authenticate", async () => {

    const inMemoryRepo = new inMemoryRepository();
    const sut = new AuthenticateUseCase(inMemoryRepo);

    await inMemoryRepo.create({name: "Heber", email: "heber@gmail.com", password_hash: await hash("123456", 6)})

    const { user } = await sut.handle({

      email: "heber@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate with wrong email", async () => {

    const inMemoryRepo = new inMemoryRepository();
    const sut = new AuthenticateUseCase(inMemoryRepo);

    

    await expect(

        sut.handle({
      email: "heber@gmail.com",
      password: "123456",
    })

    ).rejects.toBeInstanceOf(InvalidCredentials)


  });


  it("Should not be able to authenticate with wrong password", async () => {

    const inMemoryRepo = new inMemoryRepository();
    const sut = new AuthenticateUseCase(inMemoryRepo);

     await inMemoryRepo.create({name: "Heber", email: "heber@gmail.com", password_hash: await hash("123456", 6)})

    await expect(

        sut.handle({
      email: "heber@gmail.com",
      password: "123457",
    })

    ).rejects.toBeInstanceOf(InvalidCredentials)


  });
});
