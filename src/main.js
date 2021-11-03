import API from "./api";
import BoardComponent from "./components/board";
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";
import MenuComponent, {MenuItem} from "./components/site-menu";
import {render} from "./utils/render";
import TasksModel from "./models/tasks";

const AUTH = `Basic aSd3scadfzd=`;
const END_POINT = `https://15.ecmascript.pages.academy/task-manager`;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const api = new API(END_POINT, AUTH);
const siteMenuComponent = new MenuComponent();
const tasksModel = new TasksModel();
const filterController = new FilterController(siteMainElement, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteHeaderElement, siteMenuComponent, `beforeend`);
filterController.render();
render(siteMainElement, boardComponent, `beforeend`);

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
  case MenuItem.NEW_TASK:
    siteMenuComponent.setActiveItem(MenuItem.TASKS);
    boardController.createTask();
    break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });


