export interface petsInput {
  name: string;
  species: string;
  breed: string;  // Nueva propiedad
  size: string;   // Nueva propiedad
  age: number;
  owner: string;  // Debe ser el ID del dueño
}

export interface petsInputUpdate {
  name?: string;
  species?: string;
  breed?: string;   // Nueva propiedad
  size?: string;    // Nueva propiedad
  age?: number;
  owner?: string;   // Nueva propiedad
}
