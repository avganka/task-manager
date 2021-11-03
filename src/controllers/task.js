import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import Task from "../models/task";
import {color, DAYS} from "../constants";
import {render, replace, remove} from "../utils/render";

const SHAKE_ANIMATION_TIMEOUT = 600;

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


const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new Task({
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "color": formData.get(`color`),
    "is_favorite": false,
    "is_done": false,
  });
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
      const newTask = Task.clone(task);
      newTask.isArchived = !newTask.isArchived;
      this._onDataChange(this, task, newTask);

    });

    this._taskComponent.setFavoritesBtnClickHandler(() => {
      const newTask = Task.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._onDataChange(this, task, newTask);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);

      this._taskEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, task, data);

    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({
        saveButtonText: `Deleting...`
      });
      this._onDataChange(this, task, null);
    });


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

  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveBtnText: `Save`,
        deleteBtnText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}