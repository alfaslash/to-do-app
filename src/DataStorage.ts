import { ProjectModel, ProjectPlainData } from './ProjectModel';
import { LocaleStorage } from './helpers/LocalStorage';
import { config } from './config/config';

export class DataStorage {
    private storage: Array<ProjectModel> = [];
    private static instance: DataStorage;

	static getInstance() {
		if (!DataStorage.instance) {
			DataStorage.instance = new DataStorage();
		}

		return DataStorage.instance;
    }
    
	private constructor() {
        const savedData = LocaleStorage.getItem<Array<ProjectPlainData>>(config.localeStorageKey);
        if (!!savedData && !!savedData.length) {
            savedData.forEach(item => {
                this.storage.push(new ProjectModel().update(item));
            });
        }
	}

    public search(str: string): Array<ProjectModel> {
        if (!str.length) {
            return this.storage;
        }
        return this.storage.filter(pm => pm.text.toLowerCase().indexOf(str.toLowerCase()) >= 0);
    }

    public get(id: string): ProjectModel {
        return this.storage.find(pm => pm.id === id);
    }

    public add(text?: string): string {
        const pm = new ProjectModel(text);
        this.storage.unshift(pm);
        return pm.id;
    }

    public replace(pm: ProjectModel): void {
        this.storage.map(projectModel => {
            if (projectModel.id === pm.id) {
                return pm;
            }
            return projectModel;
        });
    }

    public remove(id: string): void {
        this.storage = this.storage.filter(pm => pm.id !== id);
    }

    public getStorage(): Array<ProjectModel> {
        return this.storage;
    }
}
