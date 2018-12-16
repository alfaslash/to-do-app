import { config } from "./config/config";
import { ProjectModel } from "./ProjectModel";
import { DataStorage } from "./DataStorage";
import { Controller } from "./Controller";

export class Renderer {
    private controller: Controller;
    private projectsList: Array<ProjectModel>;
    private rootEl: HTMLElement;

    constructor() {
        this.controller = new Controller(this.updateProjectList.bind(this));
        this.projectsList = DataStorage.getInstance().getStorage();
        this.rootEl = document.getElementById(config.holderId);
    }

    public render() {
        const fragment = document.createDocumentFragment();
        fragment.append(
            this.createInputNode(),
            this.createProjectsNode(),
            this.createNewProjectNode()
        );

        this.rootEl.prepend(document.createElement('div'));
        this.rootEl.children[0].appendChild(fragment);
    }

    private updateProjectList(dataSource: Array<ProjectModel> = this.projectsList) {
        this.projectsList = dataSource;

        const el = document.querySelector('.project-list__project-wrapper');
        el.replaceWith(this.createProjectsNode());
    }

    private createInputNode(): Node {
        const input = document.createElement('input');
        input.className = 'project-list__search-filed';
        input.placeholder = 'Поиск по проектам...';
        input.autofocus = true;
        input.oninput = this.controller.searchByProjects();

        return input;
    }

    private createProjectsNode(): Node {
        const wrapperNode = document.createElement('div');
        wrapperNode.className = 'project-list__project-wrapper';

        this.projectsList.forEach(pm => {
            wrapperNode.appendChild(this.createProjectNode(pm));
        });

        return wrapperNode;
    }

    private createProjectNode(pm: ProjectModel): Node {
        const projectWrapperNode = document.createElement('div');
        projectWrapperNode.className = 'project-list__project';

        const projectCheckboxNode = document.createElement('input');
        projectCheckboxNode.type = 'checkbox';
        projectCheckboxNode.className = 'project-list__project-checkbox';
        projectCheckboxNode.checked = pm.isDone;
        projectCheckboxNode.onclick = this.controller.clickProject(pm);

        const projectValueNode = document.createElement('span');
        const projectValueCssModifier = pm.isDone ? ' project-list__project-value_done' : ''
        projectValueNode.className = 'project-list__project-value' + projectValueCssModifier;
        projectValueNode.innerText = pm.text;
        projectValueNode.contentEditable = 'true';
        projectValueNode.oninput = this.controller.editProject(pm);

        const projectRemoveNode = document.createElement('span');
        projectRemoveNode.className = 'project-list__remove-project';
        projectRemoveNode.innerText = 'X';
        projectRemoveNode.title = 'Удалить проект';
        projectRemoveNode.onclick = this.controller.removeProject(pm);

        projectWrapperNode.append(
            projectCheckboxNode,
            projectValueNode,
            projectRemoveNode
        );

        return projectWrapperNode;
    }

    private createNewProjectNode(): Node {
        const newProjectNode = document.createElement('div');
        newProjectNode.className = 'project-list__add-project';

        const newProjectButtonNode = document.createElement('span');
        newProjectButtonNode.className = 'project-list__add-project-button';
        newProjectButtonNode.innerText = 'Добавить новый проект';
        newProjectButtonNode.onclick = this.controller.createProject();

        newProjectNode.appendChild(newProjectButtonNode);

        return newProjectNode;
    }
}
