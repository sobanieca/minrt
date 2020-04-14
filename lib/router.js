let pathsMaps = {};
let options = {};

/*
initialize({
    root: document.querySelector("#root"),
    handlers: {
        notFound: () => {},
        getState: () => {},
        setState: () => {}
    }
})*/

class Router {
    /**
     * Initializes router and executes paths maps
     */
  async initialize(options) {

  }

  navigate(route) {
    console.log("navigating");
  }

  async mapPath(path, action) {
    if(!path) {
        throw new Error("Invalid parameter: path cannot be null or empty");
    }

    if(!action) {
        throw new Error("Invalid parameter: action cannot be null or empty");
    }

    let insertPath = (path, action) => {
        if(pathsMaps[path]) {
            throw new Error("Invalid parameter: path must be unique - seems that it is already registered in router");
        }

        pathsMaps[path] = action;
    }

    if(typeof action === "function") {
        insertPath(path, action);
    } else {
        if(typeof action === "string") {
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
