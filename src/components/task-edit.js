import {MONTH_NAMES, COLORS, DAYS} from "../constants";
import {formatTime} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import {encode} from "he";

const DefaultData = {
  deleteBtnText: `Delete`,
  saveBtnText: `Save`,
};


const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color, index) => {
      return (`
      <input
        type="radio"
        id="color-${color}-${color}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${currentColor === color ? `checked` : ``}
      />
      <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
        >${color}</label
      >                      
  `);
    }).join(``);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day, index)=>{
      return (`
        <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${repeatingDays[day] ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}"
        >${day}</label
    >
    `);
    }).join(``);
};


const createTaskEditTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, isDateShowing, isRepeatingClass, externalData} = task;


  const saveButtonText = externalData.saveBtnText;
  const deleteButtonText = externalData.deleteBtnText;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingClass ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);
  // const isBlockSaveButton = (isDateShowing && isRepeatingClass) ||
  //   (isRepeatingClass && !isRepeating(activeRepeatingDays)) ||
  //   !isAllowableDescriptionLength(description);
  const encodeDescription = encode(description);

  return (`
 <article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${encodeDescription}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                      </button>
            ${isDateShowing ?
      `<fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>`
      : ``
    }
                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingClass ? `yes` : `no`}</span>
                      </button>
              ${isRepeatingClass ?
      `<fieldset class="card__repeat-days">
                        <div class="card__repeat-days-inner">
                          ${repeatingDaysMarkup}
                        </div>
                      </fieldset>`
      : ``
    }
                    </div>
                  </div>
                  
                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colorsMarkup}
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button class="card__save" type="submit" >${saveButtonText}</button>
                  <button class="card__delete" type="button">${deleteButtonText}</button>
                </div>
              </div>
            </form>
          </article>
`);
};
export default class TaskEditComponent extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = Object.assign({}, task, {isDateShowing: !!task.dueDate, isRepeatingClass: Object.values(task.repeatingDays).some(Boolean), externalData: DefaultData});
    this._submitHandler = null;
    this._flatpickr = null;

    this._deleteButtonClickHandler = null;
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }
  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }
  reset() {
    const task = this._task;
    this._task.isDateShowing = !!task.dueDate;
    this._task.isRepeatingClass = Object.values(task.repeatingDays).some(Boolean);
    this._task.repeatingDays = Object.values(task.repeatingDays).some(Boolean);

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setData(data) {
    this._task.externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }


  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._task.isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._task.isDateShowing = !this._task.isDateShowing;

      this.rerender();
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._task.isRepeatingClass = !this._task.isRepeatingClass;

      this.rerender();
    });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._task.repeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }
  }
}