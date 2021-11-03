import LoadBtnComponent from "../components/load-more-buttons";
import SortComponent, {SORT_TYPE} from "../components/sort";
import TasksComponent from "../components/tasks";
import TaskController, {Mode, EmptyTask} from "./task";
import {render, remove} from "../utils/render";


const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTOM = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, Mode.DEFAULT);
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
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASK_COUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreBtnComponent = new LoadBtnComponent();
    this._creatingTask = null;
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

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, Mode.ADDING);
  }
  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadBtn();
  }

  _renderLoadBtn() {
    remove(this._loadMoreBtnComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
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

    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(taskModel, Mode.DEFAULT);

            if (this._showingTasksCount % SHOWING_TASK_COUNT_BY_BUTTOM === 0) {
              const destroyedTask = this._showedTaskControllers.pop();
              destroyedTask.destroy();
            }

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTasksCount = this._showedTaskControllers.length;

            this._renderLoadBtn();
          })
          .catch(() => {
            taskController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._showingTasksCount);
        })
        .catch(() => {
          taskController.shake();
        });
    } else {
      console.log(oldData.id);
      console.log(newData);
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, Mode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
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