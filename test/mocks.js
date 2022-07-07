const window = {};
window.location = {};
window.history = {};
window.location.pathname = "";
window.location.search = "";

const document = {};

document.querySelector = function (selector) {
  return {
    innerHTML: "empty",
  };
};

window.document = document;
window.onpopstate = () => {};

window.history.pushState = (state, _, route) => {
  let url = route.replace("https://", "").replace("http://", "");
  let urlParts = url.split("?");
  window.location.pathname = urlParts[0];
  window.location.search = urlParts[1];
  window.onpopstate();
};

export { window };
