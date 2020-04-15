let pathsMaps = {};
let routerOptions = {};

/*
initialize({
    root: document.querySelector("#root"),
    baseUrl: window.location.href,
    handlers: {
        notFound: () => {},
        getState: () => {},
        setState: () => {}
    }
})*/

class Router {
  /**
   * Initializes router and executes paths registrations -
   * tries to find matching path basing on current url
   * and executes corresponding action
   *
   * @param {object} options
   */
  async initialize(options) {
    routerOptions = options;
  }

  async navigate(route) {
    console.log("navigating");
  }

  /**
   * Registers new path which, when matches current url, will
   * trigger action execution. If action is provided as string
   * it will set root element innerHTML to string value. Root
   * element can be defined in initialize method.
   *
   * @param {string} path
   * @param {Function|string} action
   */
  register(path, action) {
    if (!path) {
      throw new Error("Invalid parameter: path cannot be null or empty");
    }

    if (!action) {
      throw new Error("Invalid parameter: action cannot be null or empty");
    }

    let insertPath = (path, action) => {
      if (pathsMaps[path]) {
        throw new Error(
          "Invalid parameter: path must be unique - seems that it is already registered in router"
        );
      }

      pathsMaps[path] = action;
    };

    if (typeof action === "function") {
      insertPath(path, action);
    } else {
      if (typeof action === "string") {
        insertPath(path, () => {
          options.root.innerHTML = action;
        });
      } else {
        throw new Error("Invalid parameter: action must be function or string");
      }
    }
  }
}

let router = new Router();

export default router;
