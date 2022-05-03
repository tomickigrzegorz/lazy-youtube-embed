const createElement = (el, config) => {
    const element = document.createElement(el);
    if (config) {
        setAttribute(element, typeof config === "string" ? { class: config } : config);
    }
    return element;
};
const setAttribute = (element, config) => {
    for (var key in config) {
        element.setAttribute(key, config[key]);
    }
};
const parseJson = (object) => JSON.parse(object);
const createRedButton = () => createElement("div", "ytLazy__img--svg");
const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

class ytLazy {
    constructor(classElement, { background = "rgba(0,0,0,0.9)", maxWidth = 90, overflow = false, local = true, picture = false, onResize = () => { }, createWatchIn = () => { }, }) {
        this._initial = () => {
            const getYTLazy = document.querySelectorAll(`.${this._className}`);
            for (let i = 0; i < getYTLazy.length; i++) {
                const { id, openIn, title, picture } = parseJson(getYTLazy[i].getAttribute("data-yt"));
                getYTLazy[i].appendChild(this._createImage(id, picture));
                getYTLazy[i].appendChild(createRedButton());
                if (title !== null && title !== void 0 ? title : false) {
                    const titleElement = createElement("div", "ytLazy__title");
                    titleElement.textContent = title;
                    getYTLazy[i].insertAdjacentElement("beforeend", titleElement);
                    titleElement.insertAdjacentElement("afterend", createElement("div", "ytLazy__gradient-top"));
                }
                if (openIn && this._createWatchIn) {
                    this._createWatchIn({
                        index: i,
                        link: this._link + "/watch?v=" + id,
                        template: (template) => {
                            getYTLazy[i].insertAdjacentHTML("beforeend", template);
                        },
                    });
                }
            }
            this._handEvent();
        };
        this._createImage = (id, pic) => {
            const sourcesArray = [
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
            sourcesArray.map((element) => {
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
        this._sourceURL = (id, type) => {
            return `//i.ytimg.com/vi/${id}/${type}.jpg`;
        };
        this._setLightbox = (target) => {
            const watchIn = target.closest(".ytLazy__watch-in-link");
            if (watchIn)
                return;
            const element = target.closest(".ytLazy__item");
            if (element === null || element.className !== this._className)
                return;
            const { id, local, maxWidth } = parseJson(element.getAttribute("data-yt"));
            if (local !== null && local !== void 0 ? local : this._local) {
                const frame = createElement("iframe", this._objectIframe(id, this._link));
                setAttribute(frame, {
                    width: "100%",
                    height: "100%",
                });
                element.textContent = "";
                element.appendChild(frame);
                return;
            }
            else {
                this._lightbox({ id, maxWidth });
            }
        };
        this._closeLightbox = () => {
            const isOpen = document.querySelector(".ytLazy-is-open");
            if (!isOpen)
                return;
            isOpen.textContent = "";
            isOpen.classList.remove("ytLazy-is-open");
            this._overflow && document.body.classList.remove("ytLight-active");
        };
        this._handClick = (event) => {
            event.stopPropagation();
            const { target } = event;
            this._closeLightbox();
            this._setLightbox(target);
        };
        this._handKey = (event) => {
            if (event.key !== "Escape")
                return;
            this._setLightbox(event.target);
            this._closeLightbox();
        };
        this._handEvent = () => {
            window.addEventListener("click", this._handClick);
            window.addEventListener("keydown", this._handKey);
            window.addEventListener("DOMContentLoaded", () => (this._local = this._onResize()));
            window.addEventListener("resize", debounce(() => (this._local = this._onResize()), 70));
        };
        this._objectIframe = (id, link) => {
            return {
                frameborder: "0",
                allowfullscreen: "true",
                allow: "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;",
                src: `${link}/embed/${id}?autoplay=1`,
            };
        };
        this._lightbox = ({ id, maxWidth }) => {
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
            iframCointainer.appendChild(createElement("iframe", this._objectIframe(id, this._link)));
            container.appendChild(iframCointainer);
            wrap.appendChild(container);
            iframCointainer.insertAdjacentElement("afterend", button);
            this._overLayer.appendChild(wrap);
            this._overLayer.classList.add("ytLazy-is-open");
            this._overLayer.setAttribute("style", `background:${this._background};`);
        };
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
}

export { ytLazy as default };
//# sourceMappingURL=youtubeLazy.esm.js.map
