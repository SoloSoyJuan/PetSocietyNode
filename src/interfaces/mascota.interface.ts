// interfaces/mascota.interface.ts

export interface MascotaInput {
  name: string;
  species: string;
  age: number;
  // add more fields as needed
}

export interface MascotaInputUpdate {
  // Same fields but optional, for partial updates
  name?: string;
  species?: string;
  age?: number;
}
