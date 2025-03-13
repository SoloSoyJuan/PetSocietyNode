import mongoose from "mongoose";
import { UserInput } from "../interfaces";

export interface UserDocument extends UserInput, mongoose.Document{
    createdAt: Date,
    updateAt: Date,
    deleteAt: Date
}

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, requered: true, index: true, unique: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    roles: {type: [String], required: true},
    password: {type: String, requered: true},
},{timestamps:true, collection:"users"});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);