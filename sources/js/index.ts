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
  private _createWatchIn: (params: WatchInParams) => void;
  private _onResize: () => boolean | undefined;
  private _localOpenItems: Map<Element, string> = new Map();
  private _ownsOverlay = false;
  private _debouncedResize?: (this: unknown) => void;
  private _lastOpener: HTMLElement | null = null;

  constructor(
    classElement: string,
    {
      background = "rgba(0,0,0,0.9)",
      maxWidth = 90,
      overflow = false,
      local = true,
      picture = false,
      onResize = (): boolean | undefined => undefined,
      createWatchIn = () => {},
    }: ConstructorObject = {},
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

    const existingOverlay =
      document.querySelector<HTMLElement>("body > .ytLight");
    if (existingOverlay) {
      this._overLayer = existingOverlay;
    } else {
      this._overLayer = createElement("div", "ytLight");
      document.body.appendChild(this._overLayer);
      this._ownsOverlay = true;
    }

    this._initial();
  }

  _initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this._className}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const item = getYTLazy[i];
      const parsed = parseJson(item.getAttribute("data-yt"));
      if (!parsed) continue;
      const { id, openIn, title, picture } = parsed;

      setAttribute(item as HTMLElement, {
        role: "button",
        tabindex: "0",
        "aria-label": title ? `Play video: ${title}` : "Play video",
      });

      // add image
      item.appendChild(this._createImage(id, picture));

      // add red button
      item.appendChild(createRedButton());

      if (title) {
        const titleElement = createElement("div", "ytLazy__title");
        titleElement.textContent = title;
        item.insertAdjacentElement("beforeend", titleElement);
        titleElement.insertAdjacentElement(
          "afterend",
          createElement("div", "ytLazy__gradient-top"),
        );
      }

      if (openIn && this._createWatchIn) {
        this._createWatchIn({
          index: i,
          link: this._link + "/watch?v=" + id,
          template: (template: string) => {
            item.insertAdjacentHTML("beforeend", template);
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
    sourcesArray.forEach((element) => {
      picture.appendChild(
        createElement("source", element as unknown as AttrMap),
      );
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

    const element = target.closest<HTMLElement>(".ytLazy__item");

    if (element === null || !element.classList.contains(this._className))
      return;

    const parsed = parseJson(element.getAttribute("data-yt"));
    if (!parsed) return;
    const { id, local, maxWidth, title } = parsed;

    this._lastOpener = element;

    if (local ?? this._local) {
      const frame = createElement("iframe", this._objectIframe(id, title));
      setAttribute(frame, {
        width: "100%",
        height: "100%",
      });

      if (!this._localOpenItems.has(element)) {
        this._localOpenItems.set(element, element.innerHTML);
      }
      element.textContent = "";
      element.appendChild(frame);
      element.classList.add("ytLazy-is-open-local");
      (frame as HTMLIFrameElement).focus();

      return;
    } else {
      this._lightbox({ id, maxWidth, title });
    }
  };

  // close lightbox
  _closeLightbox = () => {
    let wasOpen = false;

    if (this._localOpenItems.size > 0) {
      this._localOpenItems.forEach((html, el) => {
        el.innerHTML = html;
        el.classList.remove("ytLazy-is-open-local");
      });
      this._localOpenItems.clear();
      wasOpen = true;
    }

    const isOpen = document.querySelector(".ytLazy-is-open");
    if (isOpen) {
      isOpen.textContent = "";
      isOpen.classList.remove("ytLazy-is-open");
      isOpen.removeAttribute("role");
      isOpen.removeAttribute("aria-modal");
      isOpen.removeAttribute("aria-label");
      this._overflow && document.body.classList.remove("ytLight-active");
      wasOpen = true;
    }

    if (wasOpen && this._lastOpener && document.contains(this._lastOpener)) {
      this._lastOpener.focus();
    }
    this._lastOpener = null;
  };

  _handClick = (event: Event) => {
    event.stopPropagation();
    const { target } = event;

    this._closeLightbox();
    this._setLightbox(<HTMLElement>target);
  };

  _handKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this._closeLightbox();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const item = target.closest<HTMLElement>(".ytLazy__item");
      if (!item || !item.classList.contains(this._className)) return;
      event.preventDefault();
      this._closeLightbox();
      this._setLightbox(target);
    }
  };

  _trapFocus = (event: FocusEvent) => {
    if (!this._overLayer.classList.contains("ytLazy-is-open")) return;
    const target = event.target as Node | null;
    if (!target || this._overLayer.contains(target)) return;
    const closeBtn =
      this._overLayer.querySelector<HTMLElement>(".ytLight-close");
    closeBtn?.focus();
  };

  _handEvent = () => {
    window.addEventListener("click", this._handClick);
    window.addEventListener("keydown", this._handKey);
    document.addEventListener("focusin", this._trapFocus);

    this._applyResizeResult(this._onResize());
    this._debouncedResize = debounce(
      () => this._applyResizeResult(this._onResize()),
      70,
    );
    window.addEventListener("resize", this._debouncedResize as EventListener);
  };

  _applyResizeResult = (result: unknown) => {
    if (typeof result === "boolean") {
      this._local = result;
    }
  };

  _objectIframe = (id: string, title?: string): IframeAttrs => {
    return {
      frameborder: "0",
      allowfullscreen: "true",
      allow:
        "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;",
      src: `${this._link}/embed/${id}?autoplay=1`,
      title: title || "YouTube video player",
    };
  };

  destroy = () => {
    window.removeEventListener("click", this._handClick);
    window.removeEventListener("keydown", this._handKey);
    document.removeEventListener("focusin", this._trapFocus);
    if (this._debouncedResize) {
      window.removeEventListener(
        "resize",
        this._debouncedResize as EventListener,
      );
      this._debouncedResize = undefined;
    }

    this._closeLightbox();

    if (this._ownsOverlay && this._overLayer.parentNode) {
      this._overLayer.parentNode.removeChild(this._overLayer);
    }
  };

  _lightbox = ({ id, maxWidth, title }: LightboxObject) => {
    if (this._overflow) {
      document.body.classList.add("ytLight-active");
    }

    const button = createElement("button", "ytLight-close");
    setAttribute(button, {
      type: "button",
      title: "close movie",
      "aria-label": "Close video",
    });

    const wrap = createElement("div", "ytLight-wrap");
    const container = createElement("div", "ytLight-container");

    (this._maxWidth || maxWidth) &&
      setAttribute(container, {
        style: `max-width: ${maxWidth || this._maxWidth}%`,
      });

    const iframeContainer = createElement("div", "ytLight-iframe");

    iframeContainer.appendChild(
      createElement("iframe", this._objectIframe(id, title)),
    );
    container.appendChild(iframeContainer);
    wrap.appendChild(container);

    iframeContainer.insertAdjacentElement("afterend", button);

    this._overLayer.appendChild(wrap);
    this._overLayer.classList.add("ytLazy-is-open");
    setAttribute(this._overLayer, {
      style: `background:${this._background};`,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title || "Video player",
    });

    (button as HTMLButtonElement).focus();
  };
}
