import {createSiteMenuTemplate} from "./components/site-menu";
import {createSiteFilterTemplate} from "./components/filter";
import {createSiteBoardTemplate} from "./components/board";
import {createSiteTaskTemplate} from "./components/task";
import {createTaskEditTemplate} from "./components/task-edit";
import {createLoadMoreButtonTemplate} from "./components/load-more-buttons";

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createSiteFilterTemplate());
render(siteMainElement, createSiteBoardTemplate());

const siteTaskListElement = siteMainElement.querySelector(`.board__tasks`);
const siteBoardContainer = siteMainElement.querySelector(`.board`);

render(siteTaskListElement, createTaskEditTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  render(siteTaskListElement, createSiteTaskTemplate());
}

render(siteBoardContainer, createLoadMoreButtonTemplate());