import { FastifyInstance } from "fastify";
import { createUser } from "./controllers/register";

export async function appRoutes(app: FastifyInstance){ 

    app.post('/users', createUser)
}