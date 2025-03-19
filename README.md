
# Pet Society (API Backend)

## Descripción
Algunas veterinarias gestionan su información de una manera manual o con sistemas cerrados y de difícil acceso a información relevante para los dueños de las mascotas, Con **Pet Society** estos problemas se solucionan. **Pet Society** es un software para gestionar las citas, historias medias y pacientes de una veterinaria, de igual manera le permite a los dueños de mascotas, acceder a las historias clínicas, sin necesidad de generar mas tareas al personal.

El sistema consta de _4 módulos_ para su funcionamiento:
#### Usuarios:
Contamos con 3 roles para los usuarios, Administrador (Admin), Veterinario/personal (Vet), dueños de mascotas (owner).

- Los **Administradores** pueden crear, actualizar, eliminar o visualizar todos los elementos dentro del sistema.
- Los **Veterinarios/Personal** tienen la capacidad de registrar, visualizar y modificar información de las mascotas, pueden agendar, modificar o eliminar citas y registrar historias clínicas.
- Los **Dueños de mascotas** pueden ver la información de sus mascotas, las historias clínicas, finalmente, agendar y ver sus citas.

De los usuarios es importante tener: ID, correo electrónico, nombre y apellidos, número celular de contacto, dirección, nombre de usuario y contraseña.
#### Mascotas
De las mascotas es importante guardar, raza, edad, tamaño, nombre y una relación con el dueño. Otras cosas que están relacionadas con las mascotas son las citas médicas y las historias clínicas. Las mascotas pueden tener diferentes _citas_ al igual que _historias clínicas_.

Las mascotas solo pueden ser registradas por los Veterinarios/Personal o por los Administradores.
#### Citas
Las citas pueden ser creadas y observadas por los Dueños de mascotas, los Veterinarios/Personal y Administradores, pero solo pueden ser modificadas o los Veterinarios/Personal o Administradores del sistema.

Es necesario tener la fecha y hora, mascota, Dueño de mascota y Veterinario que va a atender a la mascota (las citas _solo pueden tener relacionado con uno de cada uno_).
#### Historias clínicas
Las historias clínicas tienen relación con una cita, una mascota y un Veterinario/Personal. Por otro lado, estás solo pueden ser creadas por los Veterinarios y ser visualizadas por el veterinarios y el dueño de la mascota vinculada a la historia clínica.

(pendientes de que información guardar)
## Endpoints

#### Usuarios
- `POST /users` → Crear un usuario
- `GET /users` → Obtener todos los usuarios
- `GET /users/{id}` → Obtener un usuario por ID
- `PUT /users/{id}` → Actualizar un usuario
- `DELETE /users/{id}` → Eliminar un usuario
- `POST /users/login` → Login de los usuarios
- `POST /users/logout` → Logout de los usuarios
#### Mascotas
- `POST /pets` → Crear una mascota _(Solo Admin y Vet)_
- `GET /pets` → Obtener todas las mascotas
- `GET /pets/{id}` → Obtener una mascota por ID
- `PUT /pets/{id}` → Actualizar una mascota _(Solo Admin y Vet)_
- `DELETE /pets/{id}` → Eliminar una mascota _(Solo Admin y Vet)_
#### Citas
- `POST /appointments` → Crear una cita _(Dueño, Admin, Vet)_
- `GET /appointments` → Obtener todas las citas
- `GET /appointments/{id}` → Obtener una cita por ID
- `PUT /appointments/{id}` → Actualizar una cita _(Solo Admin y Vet)_
- `DELETE /appointments/{id}` → Eliminar una cita _(Solo Admin y Vet)_
#### Historias clínicas
- `POST /medical-records` → Crear una historia clínica _(Solo Vet)_
- `GET /medical-records` → Obtener todas las historias clínicas _(Solo Admin y Vet)_
- `GET /medical-records/{id}` → Obtener una historia clínica por ID _(Solo Admin, Vet y Dueño relacionado)_
- `PUT /medical-records/{id}` → Actualizar una historia clínica _(Solo Vet)_
- `DELETE /medical-records/{id}` → Eliminar una historia clínica _(Solo Admin)_
## Dependencias

#### Producción
- `bcrypt` → Para el cifrado de contraseñas.
- `dotenv` → Manejo de variables de entorno.
- `express` → Framework para manejar el servidor y las rutas.
- `jsonwebtoken` → Manejo de autenticación con tokens JWT.
- `mongodb` → Cliente de MongoDB.
- `mongoose` → ODM para MongoDB, facilita la interacción con la base de datos.
- `zod` → validación y definición de esquemas de datos.
#### Desarrollo
- `@types/bcrypt` → Tipos para `bcrypt`.
- `@types/express` → Tipos para `express`.
- `@types/jest` → Tipos para `Jest`.
- `@types/jsonwebtoken` → Tipos para `jsonwebtoken`.
- `@types/node` → Tipos para Node.js.
- `types/supertest` → Tipos para `supertest`.
- `jest` → Framework de testing para JavaScript y TypeScrip.
- `nodemon` → Reinicio automático del servidor en desarrollo.
- `supertest` → Librería para hacer pruebas de endpoints HTTP en Node.js.
- `ts-jest` → Un preprocesador que permite ejecutar pruebas escritas en TypeScript.
- `ts-node` → Permite ejecutar TypeScript sin necesidad de compilarlo manualmente.
- `typescript` → Compilador de TypeScript.

Para instalar todas las dependencias es con el siguiente comando
```sh
yarn install
```
## Cómo ejecutar
#### Producción
Primero se tiene que compilar el código Typescript:
```sh
yarn build
```
Esto generará los archivos compilados dentro del directorio `dist/`.

Para ejecutar el programa en modo producción necesita el siguiente comando:
```sh
yarn start
```
#### Desarrollo
Para ejecutarlo en modo desarrollo con recarga automática:
```sh
yarn dev
```
#### Pruebas
Para las pruebas realizadas en `Jest` se ejecuta el siguiente comando:
```sh
yarn test
yarn coverage
```
