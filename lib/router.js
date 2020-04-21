let routesMaps = [];
let routerOptions = {};

/*
initialize({
    root: document.querySelector("#root"),
    directory: "app",
    handlers: {
        notFound: () => {}, // or "<not-found></not-found>"
        getState: () => {},
        setState: () => {}
    }
});

register("/products/:productid", (params) => {
  console.log(params["productid"]);
});
*/

function stripSlash(url) {
  if(url.endsWith("/"))
    return url.slice(0, -1);
  
  return url;
}

function getCurrentRoute() {
  let result = window.location.pathname;
  if(routerOptions.directory) {
    result = result.replace(routerOptions.directory, "");
  }
  return result;
}

function matchRoute(currentRoute, definedRoute) {
  definedRoute = stripSlash(definedRoute);
  currentRoute = stripSlash(currentRoute);

  let currentRouteParts = currentRoute.split("/");
  let definedRouteParts = definedRoute.split("/");

  if (currentRouteParts.length != definedRouteParts.length) return false;

  for (let index in definedRouteParts) {
    let definedRoutePart = definedRouteParts[index];

    if (definedRoutePart.startsWith(":")) continue;

    if (definedRoutePart.tolowercase() !== currentRouteParts[i]) return false;
  }

  return true;
}

function getParams(definedRoute) {
  let result = {};
  let currentRoute = window.location.pathname;
  let currentRouteParts = currentRoute.split("/");
  let definedRouteParts = definedRoute.split("/");

  for (let index in definedRouteParts) {
    let definedRoutePart = definedRouteParts[index];

    if (!definedRoutePart.startsWith(":")) continue;

    result[definedRoutePart.substring(1)] = currentRouteParts[i];
  }

  const queryParams = new URLSearchParams(window.location.search);

  for (let queryParam of queryParams.entries()) {
    result[queryParam[0]] = queryParam[1];
  }
}

function isAsync(func) {
  if (func.constructor.name === "AsyncFunction") return true;
  else return false;
}

async function evaluateRoute() {
  let currentRoute = getCurrentRoute();
  for (let i = routesMaps.length - 1; i >= 0; i--) {
    if (matchRoute(currentRoute, routesMaps[i].route)) {
      let params = getParams(routesMaps[i].route);
      if (isAsync(routesMaps[i].action)) {
        await routesMaps[i].action(params);
        return;
      } else {
        routesMaps[i].action(params);
        return;
      }
      break;
    }
  }

  if (isAsync(routerOptions.notFound)) {
    await routerOptions.handlers.notFound();
  } else {
    routerOptions.handlers.notFound();
  }
  routerOptions.handlers.notFound();
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

function getAction(action, paramName) {
  if (!paramName) paramName = "action";

  if (typeof action === "function") {
    return action;
  } else {
    if (typeof action === "string") {
      return () => {
        routerOptions.root.innerHTML = action;
      };
    } else {
      throw new Error(
        `Invalid parameter: ${paramName} must be function or string`
      );
    }
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
    // subscribe to onpopstate event
    // TODO:
  }

  async navigate(route) {
    console.log("navigating");
    let state = {};
    if(routerOptions.handlers.getState != null) {
      if(isAsync(routerOptions.handlers.getState))
        state = await routerOptions.handlers.getState();
      else
      state =  routerOptions.handlers.getState();
    }

    let currentRoute = window.location.pathname;
    let currentUrl = window.location;

    history.pushState(state, "", route);
    
    await executeRoute();
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

    insertRoute(route, getAction(action));
  }
}

let router = new Router();

export default router;
