import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register_service";
import { compare } from "bcryptjs";
import { inMemoryRepository } from "../repositories/in-memory-repo/in-memory-users-repo";
import { UserAlreadyExistsError } from "./errors/userAlreadyExists";
import { string } from "zod";

describe("Register user case", () => {
    ""
  it("Should hash  the user password", async () => {
    const inMemoryRepo = new inMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepo);

    const { user } = await registerUseCase.handle({
      name: "john doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("Should not be able to register the user with same email twice", async () => {
    const inMemoryRepo = new inMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepo);

    const email = "johndoe@gmail.com";

    await registerUseCase.handle({
      name: "john doe",
      email,
      password: "123456",
    });

    expect(() =>
      registerUseCase.handle({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("Should be able to register", async () => {
    const inMemoryRepo = new inMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepo);

    const { user } = await registerUseCase.handle({
      name: "john doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
