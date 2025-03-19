// src/services/user.services.test.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userServices } from './user.service';
import { UserModel } from '../models';
import { AuthError } from '../exceptions';
import { UserInput, UserInputUpdate, UserLogin, UserLoginResponse } from '../interfaces';

// Mocks for bcrypt, jwt, and the model
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models', () => ({
  UserModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('UserServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const plainPassword = 'plainpassword';
      const userInput: UserInput = {
        name: 'Alice',
        lastname: 'Smith',
        email: 'alice@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: plainPassword,
      };

      // Simulate that the user does not exist
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      // Simulate the password hash
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      const fakeUser = { id: '1', ...userInput, password: 'hashedpassword' };
      (UserModel.create as jest.Mock).mockResolvedValue(fakeUser);

      const result = await userServices.create(userInput);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: userInput.email });
      // Verify that bcrypt.hash was called with the original password
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(UserModel.create).toHaveBeenCalledWith({ ...userInput, password: 'hashedpassword' });
      expect(result).toEqual(fakeUser);
    });

    it('should throw a ReferenceError if the user already exists', async () => {
      const userInput: UserInput = {
        name: 'Alice',
        lastname: 'Smith',
        email: 'alice@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'plainpassword',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: 'existing', email: userInput.email });
      await expect(userServices.create(userInput)).rejects.toThrow(ReferenceError);
    });

    it('should throw an error if UserModel.create rejects', async () => {
      const userInput: UserInput = {
        name: 'Alice',
        lastname: 'Smith',
        email: 'alice@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'plainpassword',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      const error = new Error('DB error');
      (UserModel.create as jest.Mock).mockRejectedValue(error);
      await expect(userServices.create(userInput)).rejects.toThrow(error);
    });
  });

  // Additional tests for getAll, getById, update, delete, login, etc. can be added here.
});
