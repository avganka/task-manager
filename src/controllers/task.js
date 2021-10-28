import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {color} from "../constants";
import {render, replace, remove} from "../utils/render";


export const Mode = {
  DEFAULT: `default`,
  EDIT: ` edit`,
  ADDING: `adding`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: color.BLACK,
  isFavorite: false,
  isArchived: false,
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

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditBtnHandler(() => {
      this._replaceTaskToEdit();
    });
    this._taskComponent.setArchiveBtnClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {isArchived: !task.isArchived}));
    });

    this._taskComponent.setFavoritesBtnClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {isFavorite: !task.isFavorite}));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));


    switch (mode) {
    case Mode.DEFAULT:
      if (oldTaskEditComponent && oldTaskComponent) {
        replace(this._taskComponent, oldTaskComponent);
        replace(this._taskEditComponent, oldTaskEditComponent);
        this._replaceEditToTask();
      } else {
        render(this._container, this._taskComponent, `beforeend`);
      }
      break;
    case Mode.ADDING:
      if (oldTaskEditComponent && oldTaskComponent) {
        remove(oldTaskComponent);
        remove(oldTaskEditComponent);
      }

      render(this._container, this._taskEditComponent, `afterbegin`);
      break;
    }
  }

  setDefaultView() {
    if (this.mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }
  _replaceEditToTask() {
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
    this.mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this.mode = Mode.EDIT;
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
  }
}