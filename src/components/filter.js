import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createSiteFilterTemplate = (filters) => {
  return (`
    <section class="main__filter filter container">
    ${filters.map((it) => {
      return (`
        <input 
        type="radio" 
        id="filter__${it.name}" 
        class="filter__input visually-hidden" 
        name="filter" 
        ${it.checked ? `checked` : ``}        
         />
          <label for="filter__${it.name}" class="filter__label">
        ${it.name} <span class="filter__${it.name}-count">${it.count}</span></label>
    `);
    }).join(``)}
    </section>
    `);
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }
  getTemplate() {
    return createSiteFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}