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
});

register("/products/:productid", (params) => {
  console.log(params["productid"]);
});
*/

function matchRoute(definedRoute) {
  let currentRoute = window.location.pathname;
  let currentRouteParts = currentRoute.split('/');
  let definedRouteParts = definedRoute.split('/');

  if(currentRouteParts.length != definedRouteParts.length) 
    return false;

  for(let index in definedRouteParts) { 
    let definedRoutePart = definedRouteParts[index];

    if(definedRoutePart.startsWith(":"))
      continue;

    if(definedRoutePart.tolowercase() !== currentRouteParts[i])
      return false;
  }

  return true;
}

function getParams(definedRoute) {
  let result = {};
  let currentRoute = window.location.pathname;
  let currentRouteParts = currentRoute.split('/');
  let definedRouteParts = definedRoute.split('/');

  for(let index in definedRouteParts) { 
    let definedRoutePart = definedRouteParts[index];

    if(!definedRoutePart.startsWith(":"))
      continue;

    result[definedRoutePart.substring(1)] = currentRouteParts[i];
  }

  const queryParams = new URLSearchParams(window.location.search);

  for(let queryParam of queryParams.entries()) {
    result[queryParam[0]] = queryParam[1];
  }
}

async function evaluateRoute() {
  for (let i = routesMaps.length - 1; i >= 0; i--) {
    if(matchRoute(routesMaps[i].route)){
      let params = getParams(routesMaps[i].route);
      if(routesMaps[i].action.constructor.name === "AsyncFunction") {
        await routesMaps[i].action(params);
      } else {
        routesMaps[i].action(params);
      }
      break;
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
