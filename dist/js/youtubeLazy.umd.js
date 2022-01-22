(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ytLazy = factory());
})(this, (function () { 'use strict';

    var addClass = function (type, name) {
        var element = document.createElement(type);
        element.className = name;
        return element;
    };
    var setAttr = function (el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };
    var parseJson = function (object) { return JSON.parse(object); };
    var createIFrame = function (id, link) {
        var iframe = addClass('iframe', '');
        setAttr(iframe, {
            frameborder: '0',
            allowfullscreen: 'true',
            allow: 'accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;',
            src: "".concat(link, "/embed/").concat(id, "?autoplay=1"),
        });
        return iframe;
    };
    var createRedButton = function () {
        var buttonW = addClass('div', 'ytLazy__thumbnail');
        var buttonS = addClass('div', 'ytLazy__img ytLazy__img--svg');
        buttonW.appendChild(buttonS);
        return buttonW;
    };

    var ytLazy = (function () {
        function ytLazy(classElement, _a) {
            var _this = this;
            var _b = _a.background, background = _b === void 0 ? 'rgba(0,0,0,0.9)' : _b, _c = _a.maxWidth, maxWidth = _c === void 0 ? 90 : _c, _d = _a.overflow, overflow = _d === void 0 ? false : _d, _e = _a.createWatchIn, createWatchIn = _e === void 0 ? function () { } : _e;
            this.initial = function () {
                var getYTLazy = document.querySelectorAll(".".concat(_this.class));
                var _loop_1 = function (i) {
                    var _a = parseJson(getYTLazy[i].getAttribute('data-yt')), id = _a.id, openIn = _a.openIn, title = _a.title;
                    setAttr(getYTLazy[i], {
                        style: "background-image:url('//i.ytimg.com/vi/".concat(id, "/sddefault.jpg');"),
                    });
                    getYTLazy[i].appendChild(createRedButton());
                    if (title !== null && title !== void 0 ? title : false) {
                        var titleElement = "<div class=\"ytLazy__title\">".concat(title, "</div><div class=\"ytLazy__gradient-top\"></div>");
                        getYTLazy[i].insertAdjacentHTML('beforeend', titleElement);
                    }
                    if (openIn && _this.createWatchIn) {
                        _this.createWatchIn({
                            link: _this.link + '/watch?v=' + id,
                            template: function (template) {
                                getYTLazy[i].insertAdjacentHTML('beforeend', template);
                            },
                        });
                    }
                };
                for (var i = 0; i < getYTLazy.length; i++) {
                    _loop_1(i);
                }
                _this.handEvent();
            };
            this.setLbox = function (target) {
                var watchIn = target.closest('.ytLazy__watch-in-link');
                if (watchIn)
                    return;
                var element = target.closest('.ytLazy__item');
                if (element === null || element.className !== _this.class)
                    return;
                var _a = parseJson(element.getAttribute('data-yt')), id = _a.id, local = _a.local, maxWidth = _a.maxWidth;
                if (local) {
                    var frame = createIFrame(id, _this.link);
                    setAttr(frame, {
                        width: '100%',
                        height: '100%',
                    });
                    element.innerHTML = '';
                    element.appendChild(frame);
                    return;
                }
                else {
                    _this.lightbox({ id: id, maxWidth: maxWidth });
                }
            };
            this.closeLbox = function () {
                var isOpen = document.querySelector('.is-open');
                if (isOpen === null)
                    return;
                isOpen.innerHTML = '';
                isOpen.classList.remove('is-open');
                if (_this.overflow) {
                    document.body.classList.remove('ytLight-active');
                }
            };
            this.handClick = function (event) {
                event.stopPropagation();
                var target = event.target;
                _this.closeLbox();
                _this.setLbox(target);
            };
            this.handKey = function (event) {
                if (event.key !== 'Escape')
                    return;
                _this.setLbox(event.target);
                _this.closeLbox();
            };
            this.handEvent = function () {
                window.addEventListener('click', _this.handClick);
                window.addEventListener('keydown', _this.handKey);
            };
            this.lightbox = function (_a) {
                var id = _a.id, maxWidth = _a.maxWidth;
                if (_this.overflow) {
                    document.body.classList.add('ytLight-active');
                }
                var button = addClass('button', 'ytLight-close');
                setAttr(button, {
                    type: 'button',
                    title: 'close movie',
                });
                var wrap = addClass('div', 'ytLight-wrap');
                var container = addClass('div', 'ytLight-container');
                (_this.maxWidth || maxWidth) &&
                    setAttr(container, {
                        style: "max-width: ".concat(maxWidth || _this.maxWidth, "%"),
                    });
                var iframCointainer = addClass('div', 'ytLight-iframe');
                iframCointainer.appendChild(createIFrame(id, _this.link));
                container.appendChild(iframCointainer);
                wrap.appendChild(container);
                iframCointainer.insertAdjacentElement('afterend', button);
                var overlay = _this.overLayer;
                overlay.appendChild(wrap);
                overlay.classList.add('is-open');
                overlay.setAttribute('style', "background:".concat(_this.background, ";"));
            };
            this.class = classElement;
            this.background = background;
            this.overflow = overflow;
            this.maxWidth = maxWidth;
            this.createWatchIn = createWatchIn;
            this.link = 'https://www.youtube.com';
            this.overLayer = addClass('div', 'ytLight');
            var overLayer = this.overLayer;
            document.body.appendChild(overLayer);
            this.initial();
        }
        return ytLazy;
    }());

    return ytLazy;

}));
//# sourceMappingURL=youtubeLazy.umd.js.map
