import type { Genre } from "./genre";

export interface Project {
    id: number;
    name: string;
    //genre: Genre[];
    genre: string;
    description: string;
    date: string;
    likes: number;
}
