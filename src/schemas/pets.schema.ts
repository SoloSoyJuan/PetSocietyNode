import { object, string, number, array } from "zod";

export const petsSchema = object({
    name: string({required_error: "Name is required", invalid_type_error: "Name must be a string",}),
    species: string({required_error: "Species is required", invalid_type_error: "Species must be a string",}),
    breed: string({required_error: "Breed is required", invalid_type_error: "Breed must be a string",}),
    size: string({required_error: "Size is required", invalid_type_error: "Size must be a string",}),
    age: number({required_error: "Age is required", invalid_type_error: "Age must be a number",})
                .int({message: "Age must be an integer" })
                .nonnegative({message: "Age must be a positive number"}),
    owner: string({required_error: "Owner is required", invalid_type_error: "Owner must be a string",})
}).strict();

export const petsUpdateSchema = object({
    name: string({required_error: "Name is required", invalid_type_error: "Name must be a string",}),
    species: string({required_error: "Species is required", invalid_type_error: "Species must be a string",}),
    breed: string({required_error: "Breed is required", invalid_type_error: "Breed must be a string",}),
    size: string({required_error: "Size is required", invalid_type_error: "Size must be a string",}),
    age: number({required_error: "Age is required", invalid_type_error: "Age must be a number",})
                .int({message: "Age must be an integer" })
                .nonnegative({message: "Age must be a positive number"}),
    owner: string({required_error: "Owner is required", invalid_type_error: "Owner must be a string",})
}).strict();