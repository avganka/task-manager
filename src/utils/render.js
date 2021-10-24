export const createElement = (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;

    return newElement.firstChild.nextSibling;
};

export const render = (container, component, place) => {
    switch (place) {
        case `afterbegin`:
            container.prepend(component.getElement());
            break;
        case `beforeend`:
            container.append(component.getElement());
            break;
    }
};

export const replace = (newComponent, oldComponent) => {
    const parentElement = oldComponent.getElement().parentElement;
    const newElement = newComponent.getElement();
    const oldElement = oldComponent.getElement();

    const isExistElements = !!(parentElement && newElement && oldElement);

    if (isExistElements && parentElement.contains(oldElement)) {
        parentElement.replaceChild(newElement, oldElement);
    }
};

export const remove = (component) => {
//   if (!(component instanceof AbstractComponent)) {
//     throw new Error(`Can remove only components`);
//   }
   component.getElement().remove();
   component.removeElement();
};