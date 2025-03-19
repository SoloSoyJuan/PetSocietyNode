import { Request, Response } from 'express';
import { petsController } from './pets.controller';
import { petsService } from '../services';

// Simulamos ("mockeamos") todas las funciones del petsService
jest.mock('../services');

describe('PetsController', () => {
  // Mocks de Request y Response de Express
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    // Se reinician los mocks antes de cada test
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar la lista de mascotas con status 200', async () => {
      const petsMock = [{ id: 1, name: 'Firulais' }, { id: 2, name: 'Michi' }];
      (petsService.getAll as jest.Mock).mockResolvedValue(petsMock);

      await petsController.getAll(mockReq as Request, mockRes as Response);

      expect(petsService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(petsMock);
    });

    it('debería retornar 500 con mensaje "No petss found" si se lanza ReferenceError', async () => {
      (petsService.getAll as jest.Mock).mockRejectedValue(new ReferenceError());

      await petsController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No petss found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      const error = new Error('DB error');
      (petsService.getAll as jest.Mock).mockRejectedValue(error);

      await petsController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('create', () => {
    it('debería crear una mascota y retornar status 201', async () => {
      const newPet = { name: 'Bobby' };
      mockReq.body = newPet;
      const createdPet = { id: 1, ...newPet };

      (petsService.create as jest.Mock).mockResolvedValue(createdPet);

      await petsController.create(mockReq as Request, mockRes as Response);

      expect(petsService.create).toHaveBeenCalledWith(newPet);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdPet);
    });

    it('debería retornar 400 con "pets already exists" si se lanza ReferenceError', async () => {
      (petsService.create as jest.Mock).mockRejectedValue(new ReferenceError());

      await petsController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'pets already exists' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      const error = new Error('DB error');
      (petsService.create as jest.Mock).mockRejectedValue(error);

      await petsController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('getById', () => {
    it('debería retornar la mascota con status 200', async () => {
      mockReq.params = { id: '1' };
      const petMock = { id: 1, name: 'Firulais' };
      (petsService.getById as jest.Mock).mockResolvedValue(petMock);

      await petsController.getById(mockReq as Request, mockRes as Response);

      expect(petsService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(petMock);
    });

    it('debería retornar 500 con "pets not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '1' };
      (petsService.getById as jest.Mock).mockRejectedValue(new ReferenceError());

      await petsController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'pets not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('DB error');
      (petsService.getById as jest.Mock).mockRejectedValue(error);

      await petsController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('update', () => {
    it('debería actualizar la mascota y retornar status 200', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Pet' };
      const updatedPet = { id: 1, name: 'Updated Pet' };

      (petsService.update as jest.Mock).mockResolvedValue(updatedPet);

      await petsController.update(mockReq as Request, mockRes as Response);

      expect(petsService.update).toHaveBeenCalledWith('1', { name: 'Updated Pet' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedPet);
    });

    it('debería retornar 500 con "pets with id 1 not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '1' };
      (petsService.update as jest.Mock).mockRejectedValue(new ReferenceError());

      await petsController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'pets with id 1 not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('DB error');
      (petsService.update as jest.Mock).mockRejectedValue(error);

      await petsController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });

  describe('delete', () => {
    it('debería eliminar la mascota y retornar status 200', async () => {
      mockReq.params = { id: '1' };
      const deleteResult = { acknowledged: true, deletedCount: 1 };

      (petsService.delete as jest.Mock).mockResolvedValue(deleteResult);

      await petsController.delete(mockReq as Request, mockRes as Response);

      expect(petsService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(deleteResult);
    });

    it('debería retornar 500 con "pets with id 1 not found" si se lanza ReferenceError', async () => {
      mockReq.params = { id: '1' };
      (petsService.delete as jest.Mock).mockRejectedValue(new ReferenceError());

      await petsController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'pets with id 1 not found' });
    });

    it('debería retornar 500 con el error original si ocurre un error distinto', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('DB error');
      (petsService.delete as jest.Mock).mockRejectedValue(error);

      await petsController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error });
    });
  });
});
