// src/services/user.services.test.ts
import bycript from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userServices } from './user.service';
import { UserModel } from '../models';
import { AuthError } from '../exceptions';
import { UserInput, UserInputUpdate, UserLogin, UserLoginResponse } from '../interfaces';

// Mocks de bcrypt, jwt y del modelo
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
    it('debería crear y retornar un nuevo usuario', async () => {
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

      // Simular que el usuario no existe
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      // Simular el hash de la contraseña
      (bycript.hash as jest.Mock).mockResolvedValue('hashedpassword');
      const fakeUser = { id: '1', ...userInput, password: 'hashedpassword' };
      (UserModel.create as jest.Mock).mockResolvedValue(fakeUser);

      const result = await userServices.create(userInput);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: userInput.email });
      // Verificamos que se haya llamado con la contraseña original
      expect(bycript.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(UserModel.create).toHaveBeenCalledWith({ ...userInput, password: 'hashedpassword' });
      expect(result).toEqual(fakeUser);
    });

    it('debería lanzar ReferenceError si el usuario ya existe', async () => {
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

    it('debería lanzar error si UserModel.create rechaza', async () => {
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
      (bycript.hash as jest.Mock).mockResolvedValue('hashedpassword');
      const error = new Error('DB error');
      (UserModel.create as jest.Mock).mockRejectedValue(error);
      await expect(userServices.create(userInput)).rejects.toThrow(error);
    });
  });

  // Otros bloques de pruebas (getAll, getById, update, delete, login, etc.) pueden agregarse aquí.
});
