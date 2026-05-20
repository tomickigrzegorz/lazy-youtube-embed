/**
 * Create picture or source element
 *
 * @param el - type of element
 * @param config - config element
 * @returns {HTMLElement}
 */
const createElement = (el: string, config?: AttrMap | string): HTMLElement => {
  const element = document.createElement(el);
  if (config) {
    setAttribute(
      element,
      typeof config === "string" ? { class: config } : config,
    );
  }
  return element;
};

/**
 * @param element - element html
 * @param config - attributes
 */
const setAttribute = (element: HTMLElement, config?: AttrMap) => {
  if (!config) return;
  for (const key in config) {
    element.setAttribute(key, config[key]);
  }
};

/**
 * @param object - object
 */
const parseJson = (object: string | null): Record<string, any> | null => {
  if (object == null) return null;
  try {
    return JSON.parse(object);
  } catch {
    console.error("ytLazy: invalid JSON in data-yt attribute:", object);
    return null;
  }
};

/**
 * @returns red play icon (decorative — the parent .ytLazy__item is the interactive control)
 */
const createRedButton = () => {
  const el = createElement("div", "ytLazy__img--svg");
  el.setAttribute("aria-hidden", "true");
  return el;
};

/**
 * @function debounce - debounce function
 *
 * @param fn function
 * @param ms time
 */
const debounce = <A extends unknown[]>(
  fn: (...args: A) => unknown,
  ms = 300,
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: A) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export { createElement, setAttribute, parseJson, debounce, createRedButton };
