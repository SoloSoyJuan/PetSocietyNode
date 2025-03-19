// src/services/appointment.service.test.ts
import { appointmentService } from "./appointment.service";
import { appointmentModel } from "../models";
import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";

// Simulamos las funciones del modelo
jest.mock("../models", () => ({
  appointmentModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("AppointmentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("debería retornar todas las citas", async () => {
      const fakeAppointments = [
        { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId: "pet123", ownerId: "owner123" },
        { id: "2", date: new Date("2025-03-19"), time: "11:00", doctorId: "doc124", petId: "pet124", ownerId: "owner124" },
      ];
      (appointmentModel.find as jest.Mock).mockResolvedValue(fakeAppointments);

      const result = await appointmentService.getAll();

      expect(appointmentModel.find).toHaveBeenCalled();
      expect(result).toEqual(fakeAppointments);
    });

    it("debería lanzar ReferenceError si no se encuentran citas", async () => {
      (appointmentModel.find as jest.Mock).mockResolvedValue(null);
      await expect(appointmentService.getAll()).rejects.toThrow(ReferenceError);
    });
  });

  describe("getById", () => {
    it("debería retornar la cita si se encuentra", async () => {
      const fakeAppointment = { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId: "pet123", ownerId: "owner123" };
      (appointmentModel.findById as jest.Mock).mockResolvedValue(fakeAppointment);

      const result = await appointmentService.getById("1");

      expect(appointmentModel.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(fakeAppointment);
    });

    it("debería lanzar ReferenceError si no se encuentra la cita", async () => {
      (appointmentModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(appointmentService.getById("1")).rejects.toThrow(ReferenceError);
    });
  });

  describe("create", () => {
    it("debería crear y retornar una nueva cita si no existe", async () => {
      const appointmentInput: AppointmentInput = {
        date: new Date("2025-03-18"),
        time: "10:00",
        doctorId: "doc123",
        petId: "pet123",
        ownerId: "owner123"
      };
      (appointmentModel.findOne as jest.Mock).mockResolvedValue(null);
      const fakeAppointment = { id: "1", ...appointmentInput };
      (appointmentModel.create as jest.Mock).mockResolvedValue(fakeAppointment);

      const result = await appointmentService.create(appointmentInput);

      expect(appointmentModel.findOne).toHaveBeenCalledWith({
        date: appointmentInput.date,
        time: appointmentInput.time,
      });
      expect(appointmentModel.create).toHaveBeenCalledWith(appointmentInput);
      expect(result).toEqual(fakeAppointment);
    });

    it("debería lanzar ReferenceError si ya existe una cita en la misma fecha y hora", async () => {
      const appointmentInput: AppointmentInput = {
        date: new Date("2025-03-18"),
        time: "10:00",
        doctorId: "doc123",
        petId: "pet123",
        ownerId: "owner123"
      };
      (appointmentModel.findOne as jest.Mock).mockResolvedValue({ id: "existing" });
      await expect(appointmentService.create(appointmentInput)).rejects.toThrow(ReferenceError);
    });
  });

  describe("update", () => {
    it("debería actualizar y retornar la cita actualizada si existe", async () => {
      const fakeAppointment = { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId: "pet123", ownerId: "owner123" };
      (appointmentModel.findById as jest.Mock).mockResolvedValue(fakeAppointment);

      const updateInput: AppointmentUpdateInput = {
        date: new Date("2025-03-19"),
        time: "11:00",
        doctorId: "doc123",
        petId: "pet123",
        ownerId: "owner123"
      };
      const updatedAppointment = { id: "1", ...updateInput };
      (appointmentModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedAppointment);

      const result = await appointmentService.update("1", updateInput);

      expect(appointmentModel.findById).toHaveBeenCalledWith("1");
      expect(appointmentModel.findByIdAndUpdate).toHaveBeenCalledWith("1", updateInput, { new: true });
      expect(result).toEqual(updatedAppointment);
    });

    it("debería lanzar ReferenceError si la cita a actualizar no existe", async () => {
      (appointmentModel.findById as jest.Mock).mockResolvedValue(null);
      const updateInput: AppointmentUpdateInput = {
        date: new Date("2025-03-19"),
        time: "11:00",
        doctorId: "doc123",
        petId: "pet123",
        ownerId: "owner123"
      };
      await expect(appointmentService.update("1", updateInput)).rejects.toThrow(ReferenceError);
    });
  });

  describe("delete", () => {
    it("debería eliminar y retornar la cita eliminada si existe", async () => {
      const fakeAppointment = { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId: "pet123", ownerId: "owner123" };
      (appointmentModel.findById as jest.Mock).mockResolvedValue(fakeAppointment);
      (appointmentModel.findByIdAndDelete as jest.Mock).mockResolvedValue(fakeAppointment);

      const result = await appointmentService.delete("1");

      expect(appointmentModel.findById).toHaveBeenCalledWith("1");
      expect(appointmentModel.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(result).toEqual(fakeAppointment);
    });

    it("debería lanzar ReferenceError si la cita a eliminar no existe", async () => {
      (appointmentModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(appointmentService.delete("1")).rejects.toThrow(ReferenceError);
    });
  });

  describe("getByPetId", () => {
    it("debería retornar las citas correspondientes a un petId dado", async () => {
      const petId = "pet123";
      const fakeAppointments = [
        { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId, ownerId: "owner123" }
      ];
      (appointmentModel.find as jest.Mock).mockResolvedValue(fakeAppointments);

      const result = await appointmentService.getByPetId(petId);

      expect(appointmentModel.find).toHaveBeenCalledWith({ pet: petId });
      expect(result).toEqual(fakeAppointments);
    });

    it("debería lanzar ReferenceError si no se encuentran citas para el petId", async () => {
      (appointmentModel.find as jest.Mock).mockResolvedValue(null);
      await expect(appointmentService.getByPetId("pet123")).rejects.toThrow(ReferenceError);
    });
  });

  describe("getByUserId", () => {
    it("debería retornar las citas correspondientes a un userId dado", async () => {
      const userId = "user123";
      const fakeAppointments = [
        { id: "1", date: new Date("2025-03-18"), time: "10:00", doctorId: "doc123", petId: "pet123", ownerId: userId }
      ];
      (appointmentModel.find as jest.Mock).mockResolvedValue(fakeAppointments);

      const result = await appointmentService.getByUserId(userId);

      expect(appointmentModel.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(fakeAppointments);
    });

    it("debería lanzar ReferenceError si no se encuentran citas para el userId", async () => {
      (appointmentModel.find as jest.Mock).mockResolvedValue(null);
      await expect(appointmentService.getByUserId("user123")).rejects.toThrow(ReferenceError);
    });
  });
});
