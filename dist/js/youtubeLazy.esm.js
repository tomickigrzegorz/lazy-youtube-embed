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
        var _b = _a.background, background = _b === void 0 ? '#000' : _b, _c = _a.opacity, opacity = _c === void 0 ? 80 : _c, _d = _a.maxWidth, maxWidth = _d === void 0 ? 90 : _d, _e = _a.overflow, overflow = _e === void 0 ? false : _e, _f = _a.createWatchIn, createWatchIn = _f === void 0 ? function () { } : _f;
        this.initial = function () {
            var getYTLazy = document.querySelectorAll(".".concat(_this.class));
            var _loop_1 = function (i) {
                var _a = parseJson(getYTLazy[i].getAttribute('data-yt')), id = _a.id, openIn = _a.openIn;
                setAttr(getYTLazy[i], {
                    style: "background-image:url('//i.ytimg.com/vi/".concat(id, "/sddefault.jpg');"),
                });
                getYTLazy[i].appendChild(createRedButton());
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
        this.hex2rgb = function (hex, opacity) {
            if (hex === void 0) { hex = '#000'; }
            if (opacity === void 0) { opacity = 10; }
            var c = typeof hex === 'string' ? parseInt(hex.replace('#', ''), 16) : hex;
            return "rgba(".concat(c >> 16, ",").concat((c & 0xff00) >> 8, ",").concat(c & 0xff, ",").concat(opacity / 100, ")");
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
            overlay.setAttribute('style', "background:".concat(_this.hex2rgb(_this.background, _this.opacity)));
        };
        this.class = classElement;
        this.background = background;
        this.opacity = opacity;
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

export { ytLazy as default };
//# sourceMappingURL=youtubeLazy.esm.js.map
