let routesMaps = {};
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

  for(let index in routesMaps) {
    if(routesMaps[index]) {
      
    }
  }
}

class Router {
  /**
   * Initializes router and executes routes registrations -
   * tries to find matching route basing on current url
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
   * Registers new route which, when matches current url, will
   * trigger action execution. If action is provided as string
   * it will set root element innerHTML to string value. Root
   * element can be defined in initialize method.
   *
   * @param {string} route
   * @param {Function|string} action
   */
  register(route, action) {
    if (!route) {
      throw new Error("Invalid parameter: route cannot be null or empty");
    }

    if (!action) {
      throw new Error("Invalid parameter: action cannot be null or empty");
    }

    let insertRoute = (route, action) => {
      if (routesMaps[route]) {
        throw new Error(
          "Invalid parameter: route must be unique - seems that it is already registered in router"
        );
      }

      routesMaps[route] = action;
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
