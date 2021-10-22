import MenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import SortComponent from "./components/sort";
import TasksComponent from "./components/tasks";
import TaskComponent from "./components/task";
import TaskEditComponent from "./components/task-edit";
import LoadBtnComponent from "./components/load-more-buttons";

import {generateFilters} from "./mock/filter";
import {generateTasks} from "./mock/task";
import {render} from "./utils";


const TASK_COUNT = 22;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTOM = 8;

const renderTask = (taskListElement, task) => {
  const onEditBtnClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

    const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditBtnClick);

  const taskEditComponent = new TaskEditComponent(task);
  const submitForm = taskEditComponent.getElement().querySelector(`form`);
  submitForm.addEventListener(`click`, onEditFormSubmit);

  render(taskListElement, taskComponent.getElement(), `beforeend`);
};

const renderBoard = (boardComponent, tasks) => {
  render(boardComponent.getElement(), new SortComponent().getElement(), `beforeend`);
  render(boardComponent.getElement(), new TasksComponent().getElement(), `beforeend`);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);


  let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

  tasks.slice(1, showingTaskCount).forEach((task) => {
     renderTask(taskListElement, task);
  });


  const loadBtnComponent = new LoadBtnComponent();
  render(boardComponent.getElement(), loadBtnComponent.getElement(), `beforeend`);
  loadBtnComponent.getElement().addEventListener(`click`, () => {
  const prevTaskCount = showingTaskCount;
  showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTOM;

  tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
     renderTask(taskListElement, task);
     if (showingTaskCount >= tasks.length) {
       loadBtnComponent.getElement().remove();
       loadBtnComponent.removeElemet();
     }
  });
});

};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteHeaderElement, new MenuComponent().getElement(), `beforeend`);
render(siteMainElement, new FilterComponent(filters).getElement(), `beforeend`);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), `beforeend`);
renderBoard(boardComponent, tasks);

