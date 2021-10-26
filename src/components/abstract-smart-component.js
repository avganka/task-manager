import AbstractComponent from "./abstract-component";


export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    // const isExistElements = !!(parent && newElement && oldElement);
    // if (isExistElements && parent.contains(oldElement)) {
    parent.replaceChild(newElement, oldElement);
    // }

    this.recoveryListeners();
  }
}