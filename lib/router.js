let routesMaps = [];
let routerOptions = {};
let routeParams = {};

function trimSlashes(url) {
  if (url.endsWith("/")) url = url.slice(0, -1);

  if (url.startsWith("/")) url = url.substring(1);

  return url;
}

function getCurrentRoute() {
  let result = window.location.pathname;
  if (routerOptions.directory) {
    result = result.replace(routerOptions.directory, "");
  }
  return result;
}

function matchRoute(currentRoute, definedRoute) {
  definedRoute = trimSlashes(definedRoute);
  currentRoute = trimSlashes(currentRoute);

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
      routeParams = getParams(routesMaps[i].route);
      if (isAsync(routesMaps[i].action)) {
        await routesMaps[i].action(routeParams);
        return;
      } else {
        routesMaps[i].action(routeParams);
        return;
      }
    }
  }

  if (isAsync(routerOptions.notFound)) {
    await routerOptions.handlers.notFound();
  } else {
    routerOptions.handlers.notFound();
  }
}

function validateRoute(route) {
  if (!route) {
    throw new Error("Invalid parameter: route cannot be null or empty");
  }

  if (typeof route !== "string") {
    throw new Error("Invalid parameter: route must be string value");
  }
}

function validateAction(
  action,
  paramName = "action",
  required = true,
  options
) {
  if (!action && required) {
    throw new Error(`Invalid parameter: ${paramName} cannot be null or empty`);
  }

  if (!action && !required) {
    return;
  }

  if (typeof action !== "function" && typeof action !== "string") {
    throw new Error(
      `Invalid parameter: ${paramName} must be function or string`
    );
  }

  if (!options) options = routerOptions;

  if (typeof action === "string") {
    if (!options.root) {
      throw new Error(
        "Invalid router options: root is empty, provide it in initialize() method " +
          `or provide function (arrow function) as ${paramName}`
      );
    }
  }
}

function validateRouterOptions(options) {
  if (!options) return;

  if (options.root) {
    if (typeof options.root !== "string" && typeof options.root !== "object") {
      throw new Error(
        "Invalid parameter: options.root must be string or object value"
      );
    }
  }

  if (options.directory) {
    if (typeof options.directory !== "string") {
      throw new Error(
        "Invalid parameter: options.directory must be string value"
      );
    }
  }

  if (options.handlers) {
    validateAction(
      options.handlers.notFound,
      "options.handlers.notFound",
      false,
      options
    );

    let validateStateFunction = (func, name) => {
      if (func && typeof func !== "function") {
        throw new Error(
          `Invalid parameter: options.${name} must be a function`
        );
      }
    };

    validateStateFunction(options.handlers.getState, "getState");
    validateStateFunction(options.hanlders.setState, "setState");
  }
}

function getRouterOptions(options) {
  if (!options) {
    options = {};
  }

  if (!options.root) {
    options.root = document.querySelector("body");
  }

  if (!options.handlers) {
    options.handlers = {};
  }

  if (!options.handlers.notFound) {
    options.handlers.notFound = getAction(
      '<h2 class="not-found">Not Found</h2>'
    );
  }

  return options;
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
   * Returns current route params
   *
   * @returns {object} dictionary of route parameters
   */
  get routeParams() {
    return routeParams;
  }

  /**
   * Initializes router and executes routes registrations -
   * tries to find matching route basing on current url
   * and executes corresponding action
   *
   * @param {object} options options object
   */
  async initialize(options) {
    validateRouterOptions(options);
    routerOptions = getRouterOptions(options);

    window.onpopstate = async function (event) {
      if (routerOptions.handlers.setState) {
        if (isAsync(routerOptions.handlers.setState))
          await routerOptions.handlers.setState(event.state);
        else routerOptions.handlers.setState(event.state);
      }
      await evaluateRoute();
    };

    await evaluateRoute();
  }

  /**
   * Navigate to the given route and tries to match it
   * with registered routes
   *
   * @param {string} route route where to navigate f.e. /products/2
   */
  async navigate(route) {
    validateRoute(route);
    let state = {};
    if (routerOptions.handlers.getState != null) {
      if (isAsync(routerOptions.handlers.getState))
        state = await routerOptions.handlers.getState();
      else state = routerOptions.handlers.getState();
    }

    route = trimSlashes(route);

    let directory = routerOptions.directory;
    if (directory) {
      directory = trimSlashes(directory);
      route = `${directory}/${route}`;
    }

    history.pushState(state, "", `/${route}`);

    await evaluateRoute();
  }

  /**
   * Unregister route
   *
   * @param {string} route route to be unregistered
   */
  unregister(route) {
    validateRoute(route);

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
    validateRoute(route);
    validateAction(action);

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
