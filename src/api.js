import Task from "./models/task.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, auth) {
    this._endPoint = endPoint;
    this._auth = auth;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Task.parseTasks);
  }

  createTask(task) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  deleteTask(id) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  updateTask(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._auth);
    headers.append(`Content-Type`, `application/json`);

    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;