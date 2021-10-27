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
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASK_COUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreBtnComponent = new LoadBtnComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    render(container, this._sortComponent, `beforeend`);
    render(container, this._tasksComponent, `beforeend`);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadBtn();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }
  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadBtn();
  }

  _renderLoadBtn() {
    remove(this._loadMoreBtnComponent);

    if (this._showingTaskCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreBtnComponent, `beforeend`);

    this._loadMoreBtnComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASK_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadBtn();
  }

  _onDataChange(taskController, oldData, newData) {
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      taskController.render(newData);
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASK_COUNT_ON_START);
  }
  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASK_COUNT_BY_BUTTOM;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
    this._renderTasks(sortedTasks);

    if (this._showingTasksCount >= sortedTasks.length) {
      remove(this._loadMoreBtnComponent);
    }
  }

}