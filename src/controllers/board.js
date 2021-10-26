import SortComponent, {SORT_TYPE} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadBtnComponent from "../components/load-more-buttons";
import {render, remove} from "../utils/render";

import TaskController from "./task";

const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTOM = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
  case SORT_TYPE.DATE_UP:
    sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
    break;
  case SORT_TYPE.DATE_DOWN:
    sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
    break;
  case SORT_TYPE.DEFAULT:
    sortedTasks = showingTasks;
    break;
  }

  return sortedTasks.slice(from, to);
};
export default class BoardController {
  constructor(container) {
    this._container = container;

    this._task = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASK_COUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreBtnComponent = new LoadBtnComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    render(container, this._sortComponent, `beforeend`);
    render(container, this._tasksComponent, `beforeend`);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadBtn();
  }

  _renderLoadBtn() {
    if (this._showingTaskCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreBtnComponent, `beforeend`);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTaskCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTOM;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTaskCount, this._showingTasksCount);
      const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);

      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASK_COUNT_BY_BUTTOM;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount));

    const newTasks = renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;
    this._renderLoadBtn();
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

}