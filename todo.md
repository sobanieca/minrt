minrt

api:

router = import("minrt");

router.registeredRoutes; // [ "/details/:productId", "products/" ]
router.initialize({
    root: document.querySelector("#root"),
    pathPrefix: "apps",
    handlers: {
        getState: () => stateManager.getStates(),
        loadState: (state) => stateManager.replace(state),
        notFound: "<not-found></not-found>"
    }
});
router.register("/products", "<app-component id='123'></app-component>");
router.register("/details/:productId", (params) => {
    document.querySelector("body").innerHTML = `<product-component id='${params["id"]}'></product-component>`;
}));
router.routeParams["id"] // 123
router.unregister("/products");
router.navigate("/products/20");

// tests:
 initialization tests - DONE
 route matching:
  - no / trailing at the end
  - with / trailing at the beginning
  - with one parameter
  - with parameters
  - with more than 1 matching route registered
  - with pathprefix should work fine
 general:
  - registeredRoutes should return valid list of routes
  - loadState() should be loaded with proper state
  - custom not found action
  - custom not found html
  - unregister should remove path
  - routeParams collection should be properly set
