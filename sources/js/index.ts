import {
  createElement,
  createRedButton,
  parseJson,
  debounce,
  setAttribute,
} from "./utils/function";

export default class ytLazy {
  private _className: string;
  private _overLayer: HTMLElement;
  private _link: string;
  private _background?: string;
  private _picture?: boolean;
  private _local?: boolean;
  private _overflow?: boolean;
  private _maxWidth?: number;
  private _createWatchIn: Function;
  private _onResize: Function;

  constructor(
    classElement: string,
    {
      background = "rgba(0,0,0,0.9)",
      maxWidth = 90,
      overflow = false,
      local = true,
      picture = false,
      onResize = () => {},
      createWatchIn = () => {},
    }: ConstructorObject
  ) {
    this._className = classElement;
    this._background = background;
    this._local = local;
    this._overflow = overflow;
    this._picture = picture;
    this._maxWidth = maxWidth;
    this._createWatchIn = createWatchIn;
    this._onResize = onResize;
    this._link = "https://www.youtube.com";

    this._overLayer = createElement("div", "ytLight");

    document.body.appendChild(this._overLayer);

    this._initial();
  }

  _initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this._className}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const { id, openIn, title, picture } = parseJson(
        getYTLazy[i].getAttribute("data-yt")
      );

      // add image
      getYTLazy[i].appendChild(this._createImage(id, picture));

      // add red button
      getYTLazy[i].appendChild(createRedButton());

      if (title ?? false) {
        const titleElement = createElement("div", "ytLazy__title");
        titleElement.textContent = title;
        getYTLazy[i].insertAdjacentElement("beforeend", titleElement);
        titleElement.insertAdjacentElement(
          "afterend",
          createElement("div", "ytLazy__gradient-top")
        );
      }

      if (openIn && this._createWatchIn) {
        this._createWatchIn({
          index: i,
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
  _createImage = (id: string, pic: string | null): HTMLElement => {
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

    const picture = createElement("picture");
    sourcesArray.map((element: object) => {
      picture.appendChild(createElement("source", element));
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
   *
   * @param target - target element
   */
  _setLightbox = (target: HTMLElement) => {
    const watchIn = target.closest(".ytLazy__watch-in-link");
    if (watchIn) return;

    const element = target.closest(".ytLazy__item");

    if (element === null || !element.classList.contains(this._className))
      return;

    const { id, local, maxWidth } = parseJson(element.getAttribute("data-yt"));

    if (local ?? this._local) {
      const frame = createElement("iframe", this._objectIframe(id, this._link));
      setAttribute(frame, {
        width: "100%",
        height: "100%",
      });

      element.textContent = "";
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
    isOpen.textContent = "";
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

    window.addEventListener(
      "DOMContentLoaded",
      () => (this._local = this._onResize())
    );
    window.addEventListener(
      "resize",
      debounce(() => (this._local = this._onResize()), 70)
    );
  };

  _objectIframe = (id: string, link: string): object => {
    return {
      frameborder: "0",
      allowfullscreen: "true",
      allow:
        "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;",
      src: `${link}/embed/${id}?autoplay=1`,
    };
  };

  _lightbox = ({ id, maxWidth }: lightboxObject) => {
    if (this._overflow) {
      document.body.classList.add("ytLight-active");
    }

    const button = createElement("button", "ytLight-close");
    setAttribute(button, {
      type: "button",
      title: "close movie",
    });

    const wrap = createElement("div", "ytLight-wrap");
    const container = createElement("div", "ytLight-container");

    (this._maxWidth || maxWidth) &&
      setAttribute(container, {
        style: `max-width: ${maxWidth || this._maxWidth}%`,
      });

    const iframCointainer = createElement("div", "ytLight-iframe");

    iframCointainer.appendChild(
      createElement("iframe", this._objectIframe(id, this._link))
    );
    container.appendChild(iframCointainer);
    wrap.appendChild(container);

    iframCointainer.insertAdjacentElement("afterend", button);

    this._overLayer.appendChild(wrap);
    this._overLayer.classList.add("ytLazy-is-open");
    this._overLayer.setAttribute("style", `background:${this._background};`);
  };
}
