
export interface AppointmentInput {
    date: Date;
    time: string;
    doctorId: string;
    petId: string;
    ownerId: string;
}

export interface AppointmentUpdateInput {
    date: Date;
    time: string;
    doctorId: string;
    petId: string;
    ownerId: string;
}