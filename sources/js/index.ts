import {
  addClass,
  setAttribute,
  parseJson,
  createIFrame,
  createRedButton,
} from "./utils/function";

export default class ytLazy {
  private _class: string;
  private _background?: string;
  private _picture?: boolean;
  private _overflow?: boolean;
  private _overLayer: HTMLElement;
  private _maxWidth?: number | null;
  private _link: string;
  private _createWatchIn?: Function;

  constructor(
    classElement: string,
    {
      background = "rgba(0,0,0,0.9)",
      maxWidth = 90,
      overflow = false,
      picture = false,
      createWatchIn = () => {},
    }: ConstructorObject
  ) {
    this._class = classElement;
    this._background = background;
    this._overflow = overflow;
    this._picture = picture;
    this._maxWidth = maxWidth;
    this._createWatchIn = createWatchIn;
    this._link = "https://www.youtube.com";

    this._overLayer = addClass("div", "ytLight");
    document.body.appendChild(this._overLayer);

    this._initial();
  }

  _initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this._class}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const { id, openIn, title, picture } = parseJson(
        getYTLazy[i].getAttribute("data-yt")
      );

      // add image
      getYTLazy[i].appendChild(this._createImage(id, picture));

      // add red button
      getYTLazy[i].appendChild(createRedButton());

      if (title ?? false) {
        const titleElement = `<div class="ytLazy__title">${title}</div><div class="ytLazy__gradient-top"></div>`;
        getYTLazy[i].insertAdjacentHTML("beforeend", titleElement);
      }

      if (openIn && this._createWatchIn) {
        this._createWatchIn({
          link: this._link + "/watch?v=" + id,
          template: (template: string) => {
            getYTLazy[i].insertAdjacentHTML("beforeend", template);
          },
        });
      }
    }

    this._handEvent();
  };

  /**
   * Create image or picture width image
   *
   * @param id - id video
   * @returns {HTMLImageElement}
   */
  _createImage = (id: string, pic: string | null): any => {
    const sourcesArray: ConfigObject[] = [
      {
        media: "(min-width: 1440px)",
        srcset: this._sourceURL(id, "maxresdefault"),
      },
      {
        media: "(min-width: 1024px)",
        srcset: this._sourceURL(id, "hqdefault"),
      },
      {
        media: "(min-width: 480px)",
        srcset: this._sourceURL(id, "mqdefault"),
      },
    ];

    const picture = this._createElement("picture");
    sourcesArray.map((element: ConfigObject) => {
      picture.appendChild(this._createElement("source", element));
    });

    const image = new Image();
    image.className = "ytLazy__image";
    image.loading = "lazy";
    image.width = 1050;
    image.height = 787;
    image.src = this._sourceURL(id, "sddefault");

    picture.appendChild(image);

    return this._picture || pic ? picture : image;
  };

  /**
   * Image url
   *
   * @param id - movie
   * @param type - image size
   * @returns {HTMLImageElement}
   */
  _sourceURL = (id: string, type: string): string => {
    return `//i.ytimg.com/vi/${id}/${type}.jpg`;
  };

  /**
   * Create picure or source element
   *
   * @param el - type of element
   * @param config - config element
   * @returns {HTMLImageElement}
   */
  _createElement = (el: string, config?: ConfigObject): HTMLElement => {
    const element = document.createElement(el);
    if (config) {
      setAttribute(element, config);
    }
    return element;
  };

  /**
   *
   * @param target - target element
   */
  _setLightbox = (target: HTMLElement) => {
    const watchIn = target.closest(".ytLazy__watch-in-link");
    if (watchIn) return;

    const element = target.closest(".ytLazy__item");

    if (element === null || element.className !== this._class) return;

    const { id, local, maxWidth } = parseJson(element.getAttribute("data-yt"));
    if (local) {
      const frame = createIFrame(id, this._link);
      setAttribute(frame, {
        width: "100%",
        height: "100%",
      });

      element.innerHTML = "";
      element.appendChild(frame);

      return;
    } else {
      this._lightbox({ id, maxWidth });
    }
  };

  // close lightbox
  _closeLightbox = () => {
    const isOpen = document.querySelector(".ytLazy-is-open");
    if (!isOpen) return;
    isOpen.innerHTML = "";
    isOpen.classList.remove("ytLazy-is-open");
    this._overflow && document.body.classList.remove("ytLight-active");
  };

  _handClick = (event: Event) => {
    event.stopPropagation();
    const { target } = event;

    this._closeLightbox();
    this._setLightbox(<HTMLElement>target);
  };

  _handKey = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    this._setLightbox(<HTMLElement>event.target);
    this._closeLightbox();
  };

  _handEvent = () => {
    window.addEventListener("click", this._handClick);
    window.addEventListener("keydown", this._handKey);
  };

  _lightbox = ({ id, maxWidth }: { id: string; maxWidth: string }) => {
    if (this._overflow) {
      document.body.classList.add("ytLight-active");
    }

    const button = addClass("button", "ytLight-close");
    setAttribute(button, {
      type: "button",
      title: "close movie",
    });

    const wrap = addClass("div", "ytLight-wrap");
    const container = addClass("div", "ytLight-container");

    (this._maxWidth || maxWidth) &&
      setAttribute(container, {
        style: `max-width: ${maxWidth || this._maxWidth}%`,
      });

    const iframCointainer = addClass("div", "ytLight-iframe");

    iframCointainer.appendChild(createIFrame(id, this._link));
    container.appendChild(iframCointainer);
    wrap.appendChild(container);

    iframCointainer.insertAdjacentElement("afterend", button);

    this._overLayer.appendChild(wrap);
    this._overLayer.classList.add("ytLazy-is-open");
    this._overLayer.setAttribute("style", `background:${this._background};`);
  };
}
