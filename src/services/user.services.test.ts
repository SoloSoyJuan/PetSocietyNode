// src/services/user.services.test.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userServices } from './user.service';
import { UserModel } from '../models';
import { AuthError } from '../exceptions';
import { UserInput, UserInputUpdate, UserLogin } from '../interfaces';

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
  beforeEach(() => jest.clearAllMocks());

  describe('getAll', () => {
    it('returns all users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      (UserModel.find as jest.Mock).mockResolvedValue(users);
      expect(await userServices.getAll()).toEqual(users);
    });

    it('throws ReferenceError if no users found', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue(null);
      await expect(userServices.getAll()).rejects.toThrow(ReferenceError);
    });
  });

  describe('getById', () => {
    it('returns a user if found', async () => {
      const user = { id: '1' };
      (UserModel.findById as jest.Mock).mockResolvedValue(user);
      expect(await userServices.getById('1')).toEqual(user);
    });

    it('resolves null if user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(userServices.getById('1')).resolves.toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('returns a user if found', async () => {
      const user = { id: '1', email: 'test@example.com' };
      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      expect(await userServices.getByEmail('test@example.com')).toEqual(user);
    });

    it('resolves null if not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      await expect(userServices.getByEmail('missing@example.com')).resolves.toBeNull();
    });
  });

  describe('create', () => {
    it('creates and returns a new user', async () => {
      const input: UserInput = {
        name: 'Alice',
        lastname: 'Smith',
        email: 'alice@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'plainpassword'
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      const fakeUser = { id: '1', ...input, password: 'hashed' };
      (UserModel.create as jest.Mock).mockResolvedValue(fakeUser);

      const result = await userServices.create(input);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: input.email });
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
      expect(UserModel.create).toHaveBeenCalledWith({ ...input, password: 'hashed' });
      expect(result).toEqual(fakeUser);
    });

    it('throws ReferenceError if user exists', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: 'existing' });
      await expect(userServices.create({
        name: 'Alice',
        lastname: 'Smith',
        email: 'exists@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'plainpassword'
      })).rejects.toThrow(ReferenceError);
    });
  });

  describe('update', () => {
    it('updates and returns user if found', async () => {
      const existing = { id: '1', password: 'hashed' };
      (UserModel.findById as jest.Mock).mockResolvedValue(existing);
      const updated = { id: '1', name: 'Alice Updated' };
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      expect(await userServices.update('1', { name: 'Alice Updated' } as UserInputUpdate)).toEqual(updated);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Alice Updated', password: existing.password }, { new: true });
    });

    it('throws ReferenceError if not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(userServices.update('1', {} as UserInputUpdate)).rejects.toThrow(ReferenceError);
    });
  });

  describe('delete', () => {
    it('deletes and returns user if found', async () => {
      const existing = { id: '1' };
      (UserModel.findById as jest.Mock).mockResolvedValue(existing);
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(existing);

      expect(await userServices.delete('1')).toEqual(existing);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('throws ReferenceError if not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(userServices.delete('1')).rejects.toThrow(ReferenceError);
    });
  });

  describe('login', () => {
    it('returns user info and token on success', async () => {
      const login: UserLogin = { email: 'alice@example.com', password: 'plainpassword' };
      const fakeUser = {
        id: '1', name: 'Alice', lastname: 'Smith', email: 'alice@example.com',
        address: '123 Main St', phone: '1234567890', roles: ['user'], password: 'hashed'
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      expect(await userServices.login(login)).toEqual({
        user: { ...fakeUser, token: 'token' }
      });
    });

    it('throws AuthError if not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      await expect(userServices.login({ email: 'x', password: 'y' })).rejects.toThrow(AuthError);
    });

    it('throws AuthError if password mismatch', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ id: '1', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(userServices.login({ email: 'x', password: 'wrong' })).rejects.toThrow(AuthError);
    });
  });

  describe('generateToken', () => {
    it('signs correct payload and returns token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token_string');
      const fakeUser = { id: '1', email: 'alice@example.com', roles: ['user'] } as unknown as UserDocument;

      const token = userServices.generateToken(fakeUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { id: '1', email: 'alice@example.com', roles: ['user'] } },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
      expect(token).toBe('token_string');
    });
  });
});
