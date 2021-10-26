import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, replace} from "../utils/render";

export default class TaskController {
    constructor(container) {
        this._container = container;

        this._taskComponent = null;
        this._taskEditComponent = null;
    }

    render(task) {
        this._taskComponent = new TaskComponent(task);
        this._taskComponent.setEditBtnHandler(() => {
          replace(this._taskEditComponent, this._taskComponent);
        });

        this._taskEditComponent = new TaskEditComponent(task);
        this._taskEditComponent.setSubmitHandler((evt) => {
          evt.preventDefault();
          replace(this._taskComponent, this._taskEditComponent);
        });

        this._taskComponent.setArchiveBtnClickHandler(() => {

        });

        this._taskComponent.setFavoritesBtnClickHandler(() => {

        });


        render(this._container, this._taskComponent, `beforeend`);
    }
}