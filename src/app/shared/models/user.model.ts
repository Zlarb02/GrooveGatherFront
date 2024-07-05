import type { Genre } from "./genre"

export interface User {
    id: number,
    name: string,
    mail: string,
    picture: string,
    password: string,
    description: string,
    role: number,
    subscription_level: number
    genres: Genre[]
}
