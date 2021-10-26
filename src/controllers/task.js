import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, replace} from "../utils/render";


const Mode = {
  DEFAULT: `default`,
  EDIT: ` edit`
};
export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this.mode = Mode.DEFAULT;
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

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
      this._onDataChange(this, task, Object.assign({}, task, {isArchived: !task.isArchived}));
    });

    this._taskComponent.setFavoritesBtnClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {isFavorite: !task.isFavorite}));
    });

    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent, `beforeend`);
    }
  }

  setDefaultView() {
    if (this.mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }
  _replaceEditToTask() {
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
    this.mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this.mode = Mode.EDIT;
  }
}