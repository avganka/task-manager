import {COLORS} from "../variables";

const DefaultRepeatingDays = {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
};

const DescriptionItems = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
];

const getRandomArrayItem = (array) => {
    const randomIndex = getRandomIntegerNumber(0, array.length);
    return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
    return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
    const targetDate = new Date();
    const sign = Math.random() > 0.5 ? 1 : -1;
    const diffValue = sign * getRandomIntegerNumber(0, 8);

    targetDate.setDate(targetDate.getDate() + diffValue);
    return targetDate;
};

const generateRepeatingDays = () => {
    return Object.assign({}, DefaultRepeatingDays, {'mo': Math.random() > 0.5});
};


const generateTask = () => {
    const dueDate = Math.random() > 0.5 ? getRandomDate() : null;
    return {
        color: getRandomArrayItem(COLORS),
        dueDate,
        description: getRandomArrayItem(DescriptionItems),
        repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
        isArchived: Math.random() > 0.5,
        isFavorive: Math.random() > 0.5,
    };
};

const generateTasks = (count) => {
    return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks};