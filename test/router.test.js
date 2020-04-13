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

  describe("when something", function () {
    it("should do something", function () {
      sinon.fake();
      router.navigate("/somewhere");

      assert.equal(1, 1);
    });
  });

  //mapPath tests:
  /*
  empty path
  empty action
  already existing path
  non string/function action
  */
});
