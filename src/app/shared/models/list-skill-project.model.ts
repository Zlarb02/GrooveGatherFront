import type { skillName } from "./skill-name";

export interface ListSkillProject {
    project_id: number;
    name: skillName;
    isMissing: boolean;
}
