let pathMaps = {};

class RouterOptions {}

class Router {
  initialize(options) {}

  navigate(route) {
    console.log("navigating");
  }

  mapPath(path, action) {
    console.log("map path..");
  }
}

let router = new Router();

export default router;
