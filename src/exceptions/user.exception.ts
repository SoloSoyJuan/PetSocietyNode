export class AuthError extends Error {
    name: string = this.constructor.name;
    stack: string = "Authentication error \n" + this.stack;
}