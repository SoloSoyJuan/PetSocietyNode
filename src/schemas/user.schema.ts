import { object, string, number, array } from "zod";

export const userSchema = object({
    name: string({required_error: "Name is required", invalid_type_error: "Name must be a string",}),
    lastname: string({required_error: "Lastname is required", invalid_type_error: "Lastname must be a string",}),
    email: string({required_error: "Email is requiered"})
                .email({message: "Invalid email format"}),
    address: string({required_error: "Address is required", invalid_type_error: "Address must be a string",}),
    phone: number({required_error: "Phone is required", invalid_type_error: "Phone must be a number",})
                .min(1000000000, {message: "Phone must be at least 10 digits"})
                .max(9999999999, {message: "Phone must be at most 10 digits"}),
    roles: string({required_error: "Role is required", invalid_type_error: "Role must be string"})
                .array()
                .nonempty({message: "Role must have at least one element"}),
    password: string({required_error: "Password is required"})
                .min(6, {message: "Password must be at least 6 characters"}),
}).strict();

export const userUpdateSchema = object({
    name: string({required_error: "Name is required", invalid_type_error: "Name must be a string",}),
    lastname: string({required_error: "Lastname is required", invalid_type_error: "Lastname must be a string",}),
    email: string({required_error: "Email is requiered"})
                .email({message: "Invalid email format"}),
    address: string({required_error: "Address is required", invalid_type_error: "Address must be a string",}),
    phone: number({required_error: "Phone is required", invalid_type_error: "Phone must be a number",})
                .min(1000000000, {message: "Phone must be at least 10 digits"})
                .max(9999999999, {message: "Phone must be at most 10 digits"}),
    roles: string({required_error: "Role is required", invalid_type_error: "Role must be string"})
                .array()
                .nonempty({message: "Role must have at least one element"}),
    password: string({required_error: "Password is required"})
                .min(6, {message: "Password must be at least 6 characters"}),
}).strict();

export const userLoginSchema = object({
    email: string({required_error: "Email is requiered"})
                .email({message: "Invalid email format"}),
    password: string({required_error: "Password is required"})
                .min(6, {message: "Password must be at least 6 characters"})
}).strict();