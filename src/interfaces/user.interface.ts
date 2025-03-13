export interface UserInput{
    name: string,
    lastname: string,
    email: string,
    address: string,
    phone: string,
    roles: string[],
    password: string
}

export interface UserInputUpdate{
    name: string,
    lastname: string,
    email: string,
    address: string,
    phone: string,
    roles: string[],
    password: string
}

export interface UserLogin{
    email: string,
    password: string
}

export interface UserLoginResponse{
        user:{
            id: string,
            name: string,
            lastname: string,
            email: string,
            address: string,
            phone: string,
            roles: string[],
            token: string
        }
    
}