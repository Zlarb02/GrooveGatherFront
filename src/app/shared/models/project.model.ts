import type { Genre } from "./genre";
import type { skillName } from "./skill-name";

export interface Project {
    id: number;
    name: string;
    genres: Genre[];
    color: string;
    description: string;
    date: string;
    likes: number;
    skillsPresent: skillName[];
    skillsMissing: skillName[];
}
