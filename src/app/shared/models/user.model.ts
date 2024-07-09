import type { Genre } from "./genre"

export interface User {
    id?: number,
    name?: string,
    email: string,
    picture?: string,
    password: string,
    repeatedPassword?: string,
    description?: string,
    role: number,
    subscription_level: number
    genres?: Genre[]
}
