import {MONTH_NAMES} from "../constants";
import {formatTime} from "../utils/common";
import AbstractComponent from "./abstract-component";

import {encode} from "he";

const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, isArchived,
    isFavorite} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const archiveBtnInactiveClass = isArchived ? `` : `card__btn--disabled`;
  const favoriteBtnInactiveClass = isFavorite ? `` : `card__btn--disabled`;
  const encodeDescription = encode(description);


  return (`
        <article class="card card--${color} ${repeatClass} ${deadlineClass}">
          <div class="card__form">
            <div class="card__inner">
              <div class="card__control">
                <button type="button" class="card__btn card__btn--edit">
                  edit
                </button>
                <button type="button" class="card__btn card__btn--archive ${archiveBtnInactiveClass}">
                  archive
                </button>
                <button type="button" class="card__btn card__btn--favorites ${favoriteBtnInactiveClass}">
                  favorites
                </button>
              </div>

              <div class="card__color-bar">
                <svg class="card__color-bar-wave" width="100%" height="10">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>

              <div class="card__textarea-wrap">
                <p class="card__text">${encodeDescription}</p>
              </div>

              <div class="card__settings">
                <div class="card__details">
                  <div class="card__dates">
                    <div class="card__date-deadline">
                      <p class="card__input-deadline-wrap">
                        <span class="card__date">${date}</span>
                        <span class="card__time">${time}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
`);
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();

    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditBtnHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setFavoritesBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }

  setArchiveBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }
}