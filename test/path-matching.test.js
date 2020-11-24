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

  describe("when navigating to route with additional '/'", function () {
    it("should call valid function", function () {
      let rootElement = {};

      router.initialize({
        root: rootElement,
      });
      router.register("/products/1", "<div>Products</div>");

      router.navigate("/products/1/");

      assert.equal(rootElement.innerHTML, "<div>Products</div>");
    });
  });

  describe("when navigating to non existing route", function () {
    it("should create 404 element", function () {
      let rootElement = {};

      router.initialize({
        root: rootElement,
      });

      router.navigate("/non-existing/1");

      assert.equal(
        rootElement.innerHTML,
        '<h2 class="not-found">Not Found</h2>'
      );
    });
  });
});
