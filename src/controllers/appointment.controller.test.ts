// src/controllers/appointment.controller.test.ts
import { Request, Response } from 'express';
import { appointmentController } from './appointment.controller';
import { appointmentService } from '../services';
import { AppointmentInput, AppointmentUpdateInput } from '../interfaces';

// Simulamos los métodos del servicio de citas
jest.mock('../services', () => ({
  appointmentService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('AppointmentController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debería retornar la lista de citas con status 200', async () => {
      const appointmentsMock = [
        { id: '1', date: new Date('2025-03-18'), time: '10:00', doctorId: 'doc123', petId: 'pet123', ownerId: 'owner123' },
        { id: '2', date: new Date('2025-03-19'), time: '11:00', doctorId: 'doc124', petId: 'pet124', ownerId: 'owner124' },
      ];
      (appointmentService.getAll as jest.Mock).mockResolvedValue(appointmentsMock);

      await appointmentController.getAll(mockReq as Request, mockRes as Response);

      expect(appointmentService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(appointmentsMock);
    });
  });

  describe('getById', () => {
    it('debería retornar la cita con status 200', async () => {
      const appointmentMock = { id: '1', date: new Date('2025-03-18'), time: '10:00', doctorId: 'doc123', petId: 'pet123', ownerId: 'owner123' };
      mockReq.params = { id: '1' };
      (appointmentService.getById as jest.Mock).mockResolvedValue(appointmentMock);

      await appointmentController.getById(mockReq as Request, mockRes as Response);

      expect(appointmentService.getById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(appointmentMock);
    });
  });

  describe('create', () => {
    it('debería crear una cita y retornar status 201', async () => {
      // Se crea el objeto sin la propiedad "title" ya que no está definida en AppointmentInput.
      const appointmentInput: AppointmentInput = {
        date: new Date('2025-03-18'),
        time: '10:00',
        doctorId: 'doc123',
        petId: 'pet123',
        ownerId: 'owner123'
      };
      mockReq.body = appointmentInput;
      const newAppointment = { id: '1', ...appointmentInput };
      (appointmentService.create as jest.Mock).mockResolvedValue(newAppointment);

      await appointmentController.create(mockReq as Request, mockRes as Response);

      expect(appointmentService.create).toHaveBeenCalledWith(appointmentInput);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(newAppointment);
    });
  });

  describe('update', () => {
    it('debería actualizar una cita y retornar status 200', async () => {
      const appointmentUpdate: AppointmentUpdateInput = {
        date: new Date('2025-03-19'),
        time: '11:00',
        doctorId: 'doc123',
        petId: 'pet123',
        ownerId: 'owner123'
      };
      mockReq.params = { id: '1' };
      mockReq.body = appointmentUpdate;
      const updatedAppointment = { id: '1', ...appointmentUpdate };
      (appointmentService.update as jest.Mock).mockResolvedValue(updatedAppointment);

      await appointmentController.update(mockReq as Request, mockRes as Response);

      expect(appointmentService.update).toHaveBeenCalledWith('1', appointmentUpdate);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedAppointment);
    });
  });

  describe('delete', () => {
    it('debería eliminar una cita y retornar status 200', async () => {
      mockReq.params = { id: '1' };
      const deletedAppointment = { id: '1', date: new Date('2025-03-18'), time: '10:00', doctorId: 'doc123', petId: 'pet123', ownerId: 'owner123' };
      (appointmentService.delete as jest.Mock).mockResolvedValue(deletedAppointment);

      await appointmentController.delete(mockReq as Request, mockRes as Response);

      expect(appointmentService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(deletedAppointment);
    });
  });
});
