import { createUid } from "./helpers/ctrateUid";

export class ProjectModel {
    public id: string;
    public text: string;
    public isDone: boolean;

    constructor(text?: string) {
        this.id = createUid();
        this.text = text || 'Новый проект';
        this.isDone = false;
    }

    public toggleStatus(): void {
        this.isDone = !this.isDone;
    }

    public changeText(text: string): void {
        this.text = text;
    }

    public update(data: ProjectPlainData): ProjectModel {
        this.id = data.id;
        this.text = data.text;
        this.isDone = data.isDone;

        return this;
    }
}

export interface ProjectPlainData {
    id: string;
    text: string;
    isDone: boolean;
}
