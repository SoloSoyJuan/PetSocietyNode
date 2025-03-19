// tests/pets.service.test.ts
import { petsService } from './pets.service';
import { petsModel } from '../models';
import { petsInput, petsInputUpdate } from '../interfaces';

// Simulamos los métodos del modelo
jest.mock('../models', () => ({
  petsModel: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('PetsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar todas las mascotas', async () => {
      const fakePetss = [{ id: '1', name: 'Buddy' }, { id: '2', name: 'Max' }];
      (petsModel.find as jest.Mock).mockResolvedValue(fakePetss);

      const result = await petsService.getAll();

      expect(petsModel.find).toHaveBeenCalled();
      expect(result).toEqual(fakePetss);
    });

    it('debería lanzar ReferenceError si no se encuentran mascotas', async () => {
      (petsModel.find as jest.Mock).mockResolvedValue(null);

      await expect(petsService.getAll()).rejects.toThrow(ReferenceError);
    });

    it('debería lanzar error si petsModel.find rechaza', async () => {
      const error = new Error('DB error');
      (petsModel.find as jest.Mock).mockRejectedValue(error);

      await expect(petsService.getAll()).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('debería retornar la mascota cuando se encuentra', async () => {
      const fakePet = { id: '1', name: 'Buddy' };
      (petsModel.findById as jest.Mock).mockResolvedValue(fakePet);

      const result = await petsService.getById('1');

      expect(petsModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(fakePet);
    });

    it('debería retornar null si la mascota no se encuentra', async () => {
      (petsModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await petsService.getById('nonexistent');

      expect(result).toBeNull();
    });

    it('debería lanzar error si petsModel.findById rechaza', async () => {
      const error = new Error('DB error');
      (petsModel.findById as jest.Mock).mockRejectedValue(error);

      await expect(petsService.getById('1')).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('debería crear y retornar una nueva mascota', async () => {
      // Asumimos que petsInput requiere al menos la propiedad "name"
      const inputPet: petsInput = { name: 'Buddy' } as petsInput;
      const fakeCreatedPet = { id: '1', name: 'Buddy' };
      (petsModel.create as jest.Mock).mockResolvedValue(fakeCreatedPet);

      const result = await petsService.create(inputPet);

      expect(petsModel.create).toHaveBeenCalledWith(inputPet);
      expect(result).toEqual(fakeCreatedPet);
    });

    it('debería lanzar error si petsModel.create rechaza', async () => {
      const inputPet: petsInput = { name: 'Buddy' } as petsInput;
      const error = new Error('DB error');
      (petsModel.create as jest.Mock).mockRejectedValue(error);

      await expect(petsService.create(inputPet)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('debería actualizar la mascota y retornar la mascota actualizada', async () => {
      // Simula que la mascota existe
      const existingPet = { id: '1', name: 'Buddy' };
      (petsModel.findById as jest.Mock).mockResolvedValue(existingPet);

      const updateData: petsInputUpdate = { name: 'Buddy Updated' } as petsInputUpdate;
      const updatedPet = { id: '1', name: 'Buddy Updated' };
      (petsModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPet);

      const result = await petsService.update('1', updateData);

      expect(petsModel.findById).toHaveBeenCalledWith('1');
      expect(petsModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
      expect(result).toEqual(updatedPet);
    });

    it('debería lanzar ReferenceError si la mascota no existe', async () => {
      (petsModel.findById as jest.Mock).mockResolvedValue(null);

      const updateData: petsInputUpdate = { name: 'Buddy Updated' } as petsInputUpdate;
      await expect(petsService.update('nonexistent', updateData)).rejects.toThrow(ReferenceError);
    });

    it('debería lanzar error si petsModel.findByIdAndUpdate rechaza', async () => {
      const existingPet = { id: '1', name: 'Buddy' };
      (petsModel.findById as jest.Mock).mockResolvedValue(existingPet);

      const updateData: petsInputUpdate = { name: 'Buddy Updated' } as petsInputUpdate;
      const error = new Error('DB error');
      (petsModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      await expect(petsService.update('1', updateData)).rejects.toThrow(error);
    });
  });

  describe('delete', () => {
    it('debería eliminar la mascota y retornar la mascota eliminada', async () => {
      const existingPet = { id: '1', name: 'Buddy' };
      (petsModel.findById as jest.Mock).mockResolvedValue(existingPet);

      const deletedPet = { id: '1', name: 'Buddy' };
      (petsModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedPet);

      const result = await petsService.delete('1');

      expect(petsModel.findById).toHaveBeenCalledWith('1');
      expect(petsModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(deletedPet);
    });

    it('debería lanzar ReferenceError si la mascota no existe', async () => {
      (petsModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(petsService.delete('nonexistent')).rejects.toThrow(ReferenceError);
    });

    it('debería lanzar error si petsModel.findByIdAndDelete rechaza', async () => {
      const existingPet = { id: '1', name: 'Buddy' };
      (petsModel.findById as jest.Mock).mockResolvedValue(existingPet);

      const error = new Error('DB error');
      (petsModel.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

      await expect(petsService.delete('1')).rejects.toThrow(error);
    });
  });

  describe('getByOwner', () => {
    it('debería retornar las mascotas de un dueño dado', async () => {
      const owner = 'owner123';
      const petssByOwner = [
        { id: '1', name: 'Buddy', owner },
        { id: '2', name: 'Max', owner }
      ];
      (petsModel.find as jest.Mock).mockResolvedValue(petssByOwner);

      const result = await petsService.getByOwner(owner);

      expect(petsModel.find).toHaveBeenCalledWith({ owner });
      expect(result).toEqual(petssByOwner);
    });

    it('debería lanzar error si petsModel.find rechaza', async () => {
      const owner = 'owner123';
      const error = new Error('DB error');
      (petsModel.find as jest.Mock).mockRejectedValue(error);

      await expect(petsService.getByOwner(owner)).rejects.toThrow(error);
    });
  });
});
