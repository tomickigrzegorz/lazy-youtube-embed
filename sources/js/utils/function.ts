/**
 * Create picure or source element
 *
 * @param el - type of element
 * @param config - config element
 * @returns {HTMLElement}
 */
const createElement = (el: string, config?: object | string): HTMLElement => {
  const element = document.createElement(el);
  if (config) {
    setAttribute(
      element,
      typeof config === "string" ? { class: config } : config
    );
  }
  return element;
};

/**
 * @param element - element html
 * @param config - attributes
 */
const setAttribute = (element: HTMLElement, config?: LooseObject) => {
  for (var key in config) {
    element.setAttribute(key, config[key]);
  }
};

/**
 * @param object - object
 */
const parseJson = (object: any) => JSON.parse(object);

/**
 * @returns red button
 */
const createRedButton = () => createElement("div", "ytLazy__img--svg");

/**
 * @function debounce - debounce function
 *
 * @param {Function} fn function
 * @param {Number} ms time
 */
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export { createElement, setAttribute, parseJson, debounce, createRedButton };
