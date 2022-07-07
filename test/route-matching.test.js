import assert from "assert";
import { window } from "./mocks.js";

describe("given router", async function () {
  let router;

  globalThis.window = window;

  let importCounter = 0;
  beforeEach(async function () {
    let routerModule = await import(`../lib/router.js?${importCounter++}`);
    router = routerModule.default;
  });

  let testData = [
    ["/products", "/products", true],
    ["products", "products/", true],
    ["/registered", "/not-registered", false],
    ["/products/details/", "/products/details", true],
	["/products/:productid", "/products/123", true]
  ];

  testData.forEach(([registeredRoute, navigationUrl, shouldMatch]) => {
    describe(`when registered ${registeredRoute} and navigating to ${navigationUrl}`, function () {
      it(shouldMatch ? "should match" : "shouldn't match", function () {
        let rootElement = {};

        router.initialize({
          root: rootElement,
        });

        const matchingRouteContent = "<div>Matching route</div>";
        router.register(registeredRoute, matchingRouteContent);

        router.navigate(navigationUrl);

        if (shouldMatch) {
          assert.equal(rootElement.innerHTML, matchingRouteContent);
        } else {
          assert.equal(
            rootElement.innerHTML,
            '<h2 class="not-found">Not Found</h2>'
          );
        }
      });
    });
  });
});
