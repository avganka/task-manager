import {createElement} from "../utils";

const createSortTemplate = () => {
  return (`   
      <div class="board__filter-list">
        <a href="#" class="board__filter" data-sort-type="default">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-sort-type="date-up">SORT BY DATE up</a>
        <a href="#" class="board__filter" data-sort-type="date-down">SORT BY DATE down</a>
      </div>      
    `);
};

export default class SortComponent {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElemet() {
    this._element = null;
  }
}
