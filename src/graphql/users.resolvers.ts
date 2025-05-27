import { UserDocument } from "../models"
import { userServices } from "../services"
import { UserInput } from "../interfaces";

export const usersResolvers = {
    Query: {
        user: async (_root: any, params: any) => {
            //console.log(params);
            const user: UserDocument | null = await userServices.getById(params.id);
            return user;
            //return {id: "12", name: "John Doe", email: "john@example.com", password: "cualquiercosa"}
        },
        users: async (_root: any) => {
            return await userServices.getAll();
        }
    },
    Mutation: {
        createUser: async (_root: any, params: any) => {
            const userOutput: UserDocument = await userServices.create(params.input as UserInput);
            return userOutput;
        },
        updateUser: async (_root: any, params: any) => {
            const updatedUser: UserDocument | null = await userServices.update(params.id,params.input as UserInput);
            if (!updatedUser) {
            throw new Error("User not found")
            }
            return updatedUser
        },
        deleteUser: async (_root: any, { id }: { id: string }) => {
            const deleted: UserDocument | null = await userServices.delete(id);
            return deleted
        }
    }
}