import {createSiteBoardTemplate} from "./components/board";
import {createSiteFilterTemplate} from "./components/filter";
import {createLoadMoreButtonTemplate} from "./components/load-more-buttons";
import {createTaskEditTemplate} from "./components/task-edit";
import {createSiteTaskTemplate} from "./components/task";
import {createSiteMenuTemplate} from "./components/site-menu";
import {generateFilters} from "./mock/filter";
import {generateTasks} from "./mock/task";

const TASK_COUNT = 22;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTOM = 8;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createSiteFilterTemplate(filters));
render(siteMainElement, createSiteBoardTemplate());

const siteTaskListElement = siteMainElement.querySelector(`.board__tasks`);
const siteBoardContainer = siteMainElement.querySelector(`.board`);

render(siteTaskListElement, createTaskEditTemplate(tasks[0]));

let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

tasks.slice(1, showingTaskCount).forEach((task) => {
     render(siteTaskListElement, createSiteTaskTemplate(task));
  });

render(siteBoardContainer, createLoadMoreButtonTemplate());

const loadMoreBtn = siteBoardContainer.querySelector(`.load-more`);
loadMoreBtn.addEventListener(`click`, () => {
  const prevTaskCount = showingTaskCount;
  showingTaskCount = showingTaskCount + SHOWING_TASK_COUNT_BY_BUTTOM;

  tasks.slice(prevTaskCount, showingTaskCount).forEach((task) => {
     render(siteTaskListElement, createSiteTaskTemplate(task));

     if (showingTaskCount >= tasks.length) {
       loadMoreBtn.remove();
     }
  });
});