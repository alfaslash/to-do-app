import { DataStorage } from "./DataStorage";
import { ProjectModel } from "./ProjectModel";
import { LocaleStorage } from "./helpers/LocalStorage";
import { config } from "./config/config";

export class Controller {
    private dataStorage: DataStorage;
    private renderUpdater: Function;
    private searchStr: string = '';

    constructor(updater: Function) {
        this.renderUpdater = updater;
        this.dataStorage = DataStorage.getInstance();

        window.addEventListener('unload', this.unloadHandler.bind(this));
    }

    private unloadHandler(): void {
        LocaleStorage.setItem(config.localeStorageKey, this.dataStorage.getStorage())
    }

    public searchByProjects(): () => void {
        const that = this;
        return function() {
            const searchStr = this.value;
            const updatedDataStorage = that.dataStorage.search(searchStr);
            that.renderUpdater(updatedDataStorage);
            that.searchStr = searchStr;
        }
    }

    public clickProject(pm: ProjectModel): () => void {
        return () => {
            const projectModel = this.dataStorage.get(pm.id);
            projectModel.toggleStatus();
            this.dataStorage.replace(projectModel);
            this.renderUpdater();
        }
    }

    public editProject(pm: ProjectModel): (e: Event) => void {
        return (e: Event) => {
            const text = (e.target as any).textContent;
            const projectModel = this.dataStorage.get(pm.id);
            projectModel.changeText(text);
            this.dataStorage.replace(projectModel);
        }
    }

    public createProject(): () => void {
        return () => {
            this.dataStorage.add();
            this.renderUpdater();
        }
    }

    public removeProject(pm: ProjectModel): () => void {
        return () => {
            this.dataStorage.remove(pm.id);
            let projectList = this.dataStorage.getStorage();
            if (!!this.searchStr) {
                projectList = this.dataStorage.search(this.searchStr);
            }
            this.renderUpdater(projectList);
            
        }
    }
}
