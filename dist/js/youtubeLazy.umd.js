(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ytLazy = factory());
})(this, (function () { 'use strict';

    const addClass = (type, name) => {
        const element = document.createElement(type);
        element.className = name;
        return element;
    };
    const setAttribute = (el, attrs) => {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };
    const parseJson = (object) => JSON.parse(object);
    const createIFrame = (id, link) => {
        const iframe = addClass("iframe", "");
        setAttribute(iframe, {
            frameborder: "0",
            allowfullscreen: "true",
            allow: "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;",
            src: `${link}/embed/${id}?autoplay=1`,
        });
        return iframe;
    };
    const createRedButton = () => {
        const buttonW = addClass("div", "ytLazy__thumbnail");
        const buttonS = addClass("div", "ytLazy__img ytLazy__img--svg");
        buttonW.appendChild(buttonS);
        return buttonW;
    };

    class ytLazy {
        constructor(classElement, { background = "rgba(0,0,0,0.9)", maxWidth = 90, overflow = false, picture = false, createWatchIn = () => { }, }) {
            this._initial = () => {
                const getYTLazy = document.querySelectorAll(`.${this._class}`);
                for (let i = 0; i < getYTLazy.length; i++) {
                    const { id, openIn, title, picture } = parseJson(getYTLazy[i].getAttribute("data-yt"));
                    getYTLazy[i].appendChild(this._createImage(id, picture));
                    getYTLazy[i].appendChild(createRedButton());
                    if (title !== null && title !== void 0 ? title : false) {
                        const titleElement = `<div class="ytLazy__title">${title}</div><div class="ytLazy__gradient-top"></div>`;
                        getYTLazy[i].insertAdjacentHTML("beforeend", titleElement);
                    }
                    if (openIn && this._createWatchIn) {
                        this._createWatchIn({
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
                const picture = this._createElement("picture");
                sourcesArray.map((element) => {
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
            this._sourceURL = (id, type) => {
                return `//i.ytimg.com/vi/${id}/${type}.jpg`;
            };
            this._createElement = (el, config) => {
                const element = document.createElement(el);
                if (config) {
                    setAttribute(element, config);
                }
                return element;
            };
            this._setLightbox = (target) => {
                const watchIn = target.closest(".ytLazy__watch-in-link");
                if (watchIn)
                    return;
                const element = target.closest(".ytLazy__item");
                if (element === null || element.className !== this._class)
                    return;
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
                }
                else {
                    this._lightbox({ id, maxWidth });
                }
            };
            this._closeLightbox = () => {
                const isOpen = document.querySelector(".ytLazy-is-open");
                if (!isOpen)
                    return;
                isOpen.innerHTML = "";
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
            };
            this._lightbox = ({ id, maxWidth }) => {
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
    }

    return ytLazy;

}));
//# sourceMappingURL=youtubeLazy.umd.js.map
