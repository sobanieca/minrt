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

  describe("when calling register with empty route", function () {
    it("should throw an error", function () {
      assert.throws(() => {
        router.register("", () => {});
      }, /Invalid parameter: route.*/g);
    });
  });

  describe("when calling register with empty action", function () {
    it("should throw an error", function () {
      assert.throws(() => {
        router.register("/some-route", "");
      }, /Invalid parameter: action.*/g);
    });
  });

  describe("when calling register for already registered route", function () {
    it("should throw an error", function () {
      router.register("/some-route", "<some-component></some-component>");

      assert.throws(() => {
        router.register(
          "/some-route",
          "<another-component></another-component>"
        );
      }, /Invalid parameter: route must be unique/g);
    });
  });

  describe("when calling register with action of non 'string' or 'function' type", function () {
    it("should throw an error", function () {
      assert.throws(() => {
        router.register("/some-route", 100);
      }, /Invalid parameter: action must be function or string/g);
    });
  });

  describe("when calling register", function () {
    it("should register given route", function () {
      router.initialize();
      router.register("/some-route", "<app-component></app-component>");
      assert.deepEqual(router.registeredRoutes, ["some-route"]);
    });
  });

  describe("when calling unregister with null value", function () {
    it("should throw an error", function () {
      assert.throws(() => {
        router.initialize();
        router.unregister(null);
      }, /Invalid parameter: route cannot be null.*/g);
    });
  });

  describe("when calling unregister with non string value", function () {
    it("should throw an error", function () {
      assert.throws(() => {
        router.unregister(10);
      }, /Invalid parameter: route must be string.*/g);
    });
  });

  describe("when calling register then unregister", function () {
    it("should remove route resulting in empty pedRoutes array", function () {
      router.initialize({
        root: {},
      });
      router.register("/some-route", "<app-component></app-component>");
      router.unregister("/some-route");
      assert.deepEqual(router.registeredRoutes, []);
    });
  });

  describe("when calling unregister for non registered route", function () {
    it("should throw an error saying that non registered route provided", function () {
      assert.throws(() => {
        router.initialize({
          root: {},
        });
        router.register("/some-route", "<app-component></app-component>");
        router.unregister("non-registered-path");
      }, /Not registered route*/g);
    });
  });

  describe("when getting registered routes", function () {
    it("should return valid list of routes", function () {
      router.initialize({
        root: {},
      });
      router.register("path1", "<div></div>");
      router.register("/path2", "<div></div>");
      assert.deepEqual(router.registeredRoutes, ["path1", "path2"]);
    });
  });
});
