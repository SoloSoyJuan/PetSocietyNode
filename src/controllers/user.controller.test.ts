// tests/user.controller.test.ts
import { Request, Response } from 'express';
import { userController } from './user.controller';
import { userServices } from '../services';
import { AuthError } from '../exceptions';
import { UserInput, UserLogin } from '../interfaces';

// Simulamos ("mockeamos") todas las funciones de userServices
jest.mock('../services');

describe('UserController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    // Se reinician los mocks antes de cada test
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar la lista de usuarios con status 200', async () => {
      const usersMock = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
      (userServices.getAll as jest.Mock).mockResolvedValue(usersMock);

      await userController.getAll(mockReq as Request, mockRes as Response);

      expect(userServices.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(usersMock);
    });

    it('debería retornar 500 con mensaje "Not found" si se lanza ReferenceError', async () => {
      (userServices.getAll as jest.Mock).mockRejectedValue(new ReferenceError());

      await userController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      const error = new Error('DB error');
      (userServices.getAll as jest.Mock).mockRejectedValue(error);

      await userController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('create', () => {
    it('debería crear un usuario y retornar status 201', async () => {
      // Se incluyen todas las propiedades requeridas en UserInput
      const newUser: UserInput = {
        name: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'password123'
      };
      mockReq.body = newUser;

      // Simulamos que el servicio retorna el nombre o ID del nuevo usuario
      (userServices.create as jest.Mock).mockResolvedValue('John');

      await userController.create(mockReq as Request, mockRes as Response);

      expect(userServices.create).toHaveBeenCalledWith(newUser);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(`Create user: John`);
    });

    it('debería retornar 400 con "User already exists" si se lanza ReferenceError', async () => {
      (userServices.create as jest.Mock).mockRejectedValue(new ReferenceError());

      await userController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      const error = new Error('DB error');
      (userServices.create as jest.Mock).mockRejectedValue(error);

      await userController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('getById', () => {
    it('debería retornar el usuario con status 200', async () => {
      mockReq.params = { id: '123' };
      const userMock = { id: '123', name: 'John' };
      (userServices.getById as jest.Mock).mockResolvedValue(userMock);

      await userController.getById(mockReq as Request, mockRes as Response);

      expect(userServices.getById).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(userMock);
    });

    it('debería retornar 500 con "Not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '123' };
      (userServices.getById as jest.Mock).mockRejectedValue(new ReferenceError());

      await userController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '123' };
      const error = new Error('DB error');
      (userServices.getById as jest.Mock).mockRejectedValue(error);

      await userController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('update', () => {
    it('debería actualizar el usuario y retornar status 200', async () => {
      mockReq.params = { id: '123' };
      // Se incluyen todas las propiedades requeridas en UserInput
      const updatedUser: UserInput = {
        name: 'Updated John',
        lastname: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        phone: '1234567890',
        roles: ['user'],
        password: 'password123'
      };
      mockReq.body = updatedUser;

      (userServices.update as jest.Mock).mockResolvedValue({ id: '123', ...updatedUser });

      await userController.update(mockReq as Request, mockRes as Response);

      expect(userServices.update).toHaveBeenCalledWith('123', updatedUser);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: '123', ...updatedUser });
    });

    it('debería retornar 500 con "User with 123 not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '123' };
      (userServices.update as jest.Mock).mockRejectedValue(new ReferenceError());

      await userController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User with 123 not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '123' };
      const error = new Error('DB error');
      (userServices.update as jest.Mock).mockRejectedValue(error);

      await userController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('delete', () => {
    it('debería eliminar el usuario y retornar status 200', async () => {
      mockReq.params = { id: '123' };
      const deleteResult = { acknowledged: true, deletedCount: 1 };
      (userServices.delete as jest.Mock).mockResolvedValue(deleteResult);

      await userController.delete(mockReq as Request, mockRes as Response);

      expect(userServices.delete).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(deleteResult);
    });

    it('debería retornar 500 con "User with 123 not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '123' };
      (userServices.delete as jest.Mock).mockRejectedValue(new ReferenceError());

      await userController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User with 123 not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '123' };
      const error = new Error('DB error');
      (userServices.delete as jest.Mock).mockRejectedValue(error);

      await userController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('login', () => {
    it('debería retornar 200 y el objeto de respuesta al hacer login exitoso', async () => {
      const loginInput: UserLogin = { email: 'test@example.com', password: '123456' };
      mockReq.body = loginInput;
      const loginResponse = { token: 'abcd1234' };

      (userServices.login as jest.Mock).mockResolvedValue(loginResponse);

      await userController.login(mockReq as Request, mockRes as Response);

      expect(userServices.login).toHaveBeenCalledWith(loginInput);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(loginResponse);
    });

    it('debería retornar 401 y "Not authorized" si se lanza AuthError', async () => {
      const loginInput: UserLogin = { email: 'test@example.com', password: 'wrong' };
      mockReq.body = loginInput;

      (userServices.login as jest.Mock).mockRejectedValue(new AuthError('Invalid credentials'));

      await userController.login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    });

    it('debería retornar 500 y el error original si ocurre un error distinto', async () => {
      const loginInput: UserLogin = { email: 'test@example.com', password: '123456' };
      mockReq.body = loginInput;
      const error = new Error('DB error');

      (userServices.login as jest.Mock).mockRejectedValue(error);

      await userController.login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('debería no hacer nada o retornar algo apropiado (aún sin implementar)', async () => {
      await userController.logout(mockReq as Request, mockRes as Response);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });
  });
});
