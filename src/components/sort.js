import AbstractComponent from "./abstract-component";

export const SORT_TYPE = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (`   
      <div class="board__filter-list">
        <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter" data-sort-type="${SORT_TYPE.DATE_DOWN}">SORT BY DATE down</a>
      </div>      
    `);
};

export default class SortComponent extends AbstractComponent {
constructor() {
  super();

  this._currentSorType = SORT_TYPE.DEFAULT;
}
   getTemplate() {
    return createSortTemplate();
  }

  getSortType() {

  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
      return;
      }

    const sortType = evt.target.dataset.sortType;

    if (this._currentSorType === sortType) {
      return;
    }

    this._currentSorType = sortType;

    handler(this._currentSorType);

    });

  }
}

