
import BoardController from "./controllers/board";
import BoardComponent from "./components/board";

import MenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";

import {generateFilters} from "./mock/filter";
import {generateTasks} from "./mock/task";
import {render} from "./utils/render";


const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteHeaderElement, new MenuComponent(), `beforeend`);
render(siteMainElement, new FilterComponent(filters), `beforeend`);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent, `beforeend`);
boardController.render(tasks);

