let routesMaps = [];
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

function evaluateRoute() {
  let currentRoute = window.location.pathname;

  for (let index in routesMaps) {
    if (routesMaps[index]) {
    }
  }
}

function assertRoute(route) {
  if (!route) {
    throw new Error("Invalid parameter: route cannot be null or empty");
  }

  if (typeof route !== "string") {
    throw new Error("Invalid parameter: route must be string value");
  }
}

function assertAction(action) {
  if (!action) {
    throw new Error("Invalid parameter: action cannot be null or empty");
  }
}

class Router {
  /**
   * Returns registered routes withing router
   *
   * @returns {Array} array of registered routes
   */
  get registeredRoutes() {
    return routesMaps.map((x) => x.route);
  }

  /**
   * Initializes router and executes routes registrations -
   * tries to find matching route basing on current url
   * and executes corresponding action
   *
   * @param {object} options options object
   */
  async initialize(options) {
    routerOptions = options;
  }

  async navigate(route) {
    console.log("navigating");
  }

  /**
   * Unregister route
   *
   * @param {string} route route to be unregistered
   */
  unregister(route) {
    assertRoute(route);

    routesMaps = routesMaps.filter((x) => x.route !== route);
  }

  /**
   * Registers new route which, when matches current url, will
   * trigger action execution. If action is provided as string
   * it will set root element innerHTML to string value. Root
   * element can be defined in initialize method.
   *
   * @param {string} route route to be registered
   * @param {Function|string} action action to be executed when registered route matches url
   */
  register(route, action) {
    assertRoute(route);
    assertAction(action);

    let insertRoute = (route, action) => {
      if (routesMaps.find((x) => x.route === route)) {
        throw new Error(
          "Invalid parameter: route must be unique - seems that it is already registered in router"
        );
      }

      routesMaps.push({
        route,
        action,
      });
    };

    if (typeof action === "function") {
      insertRoute(route, action);
    } else {
      if (typeof action === "string") {
        insertRoute(route, () => {
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
