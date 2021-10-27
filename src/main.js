
import BoardController from "./controllers/board";
import BoardComponent from "./components/board";
import FilterController from "./controllers/filter";
import MenuComponent from "./components/site-menu";
import TasksModel from "./models/task";

import {generateTasks} from "./mock/task";
import {render} from "./utils/render";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
render(siteHeaderElement, new MenuComponent(), `beforeend`);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteMainElement, boardComponent, `beforeend`);
boardController.render(tasks);


