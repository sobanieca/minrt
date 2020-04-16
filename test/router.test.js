import assert from "assert";
let sinon;

describe("given router", function () {
  let router;

  let importCounter = 0;
  beforeEach(async function () {
    let routerModule = await import(`../lib/router.js?${importCounter}`);
    router = routerModule.default;

    let sinonModule = await import("sinon");
    sinon = sinonModule.default;
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
});
