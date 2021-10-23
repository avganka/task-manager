
import SortComponent from "../components/sort";
import TasksComponent from "../components/tasks";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import LoadBtnComponent from "../components/load-more-buttons";
import {render, replace, remove} from "../utils/render";

const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTOM = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  taskComponent.setEditBtnHandler(() => {
    replace(taskEditComponent, taskComponent);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replace(taskComponent, taskEditComponent);
  });

  render(taskListElement, taskComponent, `beforeend`);
};

export default class BoardController {
    constructor(container) {
        this._container = container;

        this._sortComponent = new SortComponent();
        this._tasksComponent = new TasksComponent();
        this._loadMoreBtnComponent = new LoadBtnComponent();
    }

    render(tasks) {
             const container = this._container.getElement();
             render(container, this._sortComponent, `beforeend`);
             render(container, this._tasksComponent, `beforeend`);

             const taskListElement = container.querySelector(`.board__tasks`);

             let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

             tasks.slice(1, showingTaskCount).forEach((task) => {
                renderTask(taskListElement, task);
             });

             const loadBtnComponent = this._loadMoreBtnComponent;
             render(container, loadBtnComponent, `beforeend`);
             loadBtnComponent.setClickHandler(() => {
             const prevTaskCount = showingTaskCount;
             showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTOM;

             tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
                renderTask(taskListElement, task);
             if (showingTaskCount >= tasks.length) {
             remove(loadBtnComponent);
            }
         });
      });
    }
}