import {isOverdue, isRepeating, isOneDay} from "./common";
import {FILTER_TYPE} from "../constants";

export const getArchivedTasks = (tasks) => {
  return tasks.filter((task) => task.isArchived);
};

export const getNotArchivedTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchived);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdue(dueDate, date);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
  case FILTER_TYPE.ALL:
    return getArchivedTasks(tasks);
  case FILTER_TYPE.ARCHIVE:
    return getArchivedTasks(tasks);
  case FILTER_TYPE.FAVORITES:
    return getFavoriteTasks(getArchivedTasks(tasks));
  case FILTER_TYPE.OVERDUE:
    return getOverdueTasks(getArchivedTasks(tasks), nowDate);
  case FILTER_TYPE.REPEATING:
    return getRepeatingTasks(getArchivedTasks(tasks));
  case FILTER_TYPE.TODAY:
    return getTasksInOneDay(getArchivedTasks(tasks), nowDate);
  }

  return tasks;
};