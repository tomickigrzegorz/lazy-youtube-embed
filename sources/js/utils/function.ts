/**
 * @param type - set div, a, span, button, etc.
 * @param name - class name
 * @returns
 */
const addClass = (type: string, name: string) => {
  const element = document.createElement(type);
  element.className = name;
  return element;
};

/**
 * @param el - element html
 * @param attrs - attributes
 */
const setAttribute = (el: HTMLElement, attrs: any) => {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/**
 * @param object - object
 */
const parseJson = (object: any) => JSON.parse(object);

/**
 * @param id - id video
 * @param link - link to video
 */
const createIFrame = (id: string, link: string) => {
  const iframe = addClass("iframe", "");
  setAttribute(iframe, {
    frameborder: "0",
    allowfullscreen: "true",
    allow:
      "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;",
    src: `${link}/embed/${id}?autoplay=1`,
  });

  return iframe;
};

/**
 * @returns red button
 */
const createRedButton = () => {
  const buttonW = addClass("div", "ytLazy__thumbnail");
  const buttonS = addClass("div", "ytLazy__img ytLazy__img--svg");

  buttonW.appendChild(buttonS);
  return buttonW;
};

export { addClass, setAttribute, parseJson, createIFrame, createRedButton };
