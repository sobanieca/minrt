minrt

api:

router = import("minrt");

router.registeredRoutes; // [ "/details/:productId", "products/" ]
router.initialize({
    root: document.querySelector("#root"),
    directory: "apps",
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