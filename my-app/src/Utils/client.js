/** @format */

// import { config } from "./config.js";
import { config } from "./config.js"
// import 
const { SERVER_AUTH_API } = config;

console.log(SERVER_AUTH_API);
// Định nghĩa các phương thức call API
export const client = {
  serverApi: SERVER_AUTH_API,

  setUrl: function (url) {
    this.serverApi = url;
  },

  send: async function (url, method = "GET", body = null, token = null) {
    url = `${this.serverApi}${url}`;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const data = await response.json();

    return { response, data };
  },

  get: function (url, token = null) {
    return this.send(url, "GET", null, token);
  },

  post: function (url, body = {}, token = null) {
    return this.send(url, "POST", body, token);
  },

  put: function (url, body = {}, token = null) {
    return this.send(url, "PUT", body, token);
  },

  patch: function (url, body = {}, token = null) {
    return this.send(url, "PATCH", body, token);
  },

  delete: function (url, token = null) {
    return this.send(url, "DELETE", null, token);
  },
};
// export const client = {

// };