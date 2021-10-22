const castTimeFormat = (value) => {
return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
    const hours = castTimeFormat(date.getHours() % 12);
    const minutes = castTimeFormat(date.getMinutes() % 12);

    return `${hours}:${minutes}`;
};

export const createElement = (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;

    return newElement.firstChild.nextSibling;
};

export const render = (container, element, place) => {
    switch (place) {
        case `afterbegin`:
            container.prepend(element);
            break;
        case `beforeend`:
            container.append(element);
            break;
    }

};

