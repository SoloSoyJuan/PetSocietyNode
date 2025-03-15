import bycript from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDocument, UserModel } from "../models";
import { UserInputUpdate, UserInput, UserLogin, UserLoginResponse } from "../interfaces";

class UserServices {

    public async getAll(): Promise<UserDocument[]> {
        
        try {
            const users: UserDocument[] | null = await UserModel.find();

            if (!users) {
                throw new ReferenceError('Users not found');
            }
            return users;
    
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }
    public async getByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            const userExists: UserDocument | null = await this.getByEmail(userInput.email);
            if (userExists !== null) {
                throw new ReferenceError('User already exists');
            } 

            if (userInput.password) {
                userInput.password = await bycript.hash(userInput.password, 10);
            }

            const user: UserDocument = await UserModel.create(userInput);
            return user;

        }catch (error) {
            throw error;
        }
    }

    public async update(id: string, userInput: UserInputUpdate): Promise<UserDocument | null> {
        try {

            const user = await this.getById(id);
            if (!user) {
                throw new ReferenceError('User not found');
            }

            userInput.password = user.password;

            const userUpdate: UserDocument | null = await UserModel.findByIdAndUpdate(id, userInput, { new: true });
            
            return userUpdate;

        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try {

            const user = await this.getById(id);
            if (user == null) {
                throw new ReferenceError("User not found");
            }

            const userDelete: UserDocument | null = await UserModel.findByIdAndDelete(id);
            return userDelete;
        } catch (error) {
            throw error;
        }
    }
    
}

export const userServices = new UserServices();