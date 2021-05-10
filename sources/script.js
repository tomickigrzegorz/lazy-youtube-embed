class ytLazy {
  constructor(classElement, { background = '#000', opacity = 90 }) {
    this.className = classElement;
    this.background = background;
    this.opacity = opacity;

    this.initial();
  }

  initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this.className}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const { id } = this.parseJson(getYTLazy[i].getAttribute('data-yt'));

      getYTLazy[i].setAttribute(
        'style',
        `background-image:url('//i.ytimg.com/vi/${id}/sddefault.jpg');`
      );

      getYTLazy[i].appendChild(this.createBtn());
    }
  };

  parseJson = (object) => JSON.parse(object);

  hex2rgb = (hex, opacity = 10) => {
    const c =
      typeof hex === 'string' ? parseInt(hex.replace('#', ''), 16) : hex;
    return `rgba(${c >> 16},${(c & 0xff00) >> 8},${c & 0xff},${opacity / 100})`;
  };

  addClass = (name) => {
    const element = document.createElement('div');
    element.className = name;
    return element;
  };

  createBtn = () => {
    const buttonW = this.addClass('ytLazy__thumbnail');
    const buttonS = this.addClass('ytLazy__img ytLazy__img--svg');

    buttonW.appendChild(buttonS);
    return buttonW;
  };

  createIFrame = (id) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute(
      'allow',
      'accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;'
    );
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;

    return iframe;
  };

  handleEvent = () => {
    [].slice.call(['click', 'keydown']).map((element) => {
      document.addEventListener(element, (event) => {
        event.stopPropagation();
        const { target } = event;

        const element = target.closest('.ytLazy__item');

        if (
          target.className === 'ytLight-close' ||
          target.className === 'ytLight-wrap' ||
          event.keyCode === 27
        ) {
          const isOpen = document.querySelector('.is-open');
          if (isOpen === null) return;
          isOpen.parentNode.removeChild(isOpen);
          document.body.classList.remove('ytLight-active');
        }

        if (element === null || element.className !== this.className) return;

        const { id, local } = this.parseJson(element.getAttribute('data-yt'));
        if (local) {
          const frame = this.createIFrame(id);
          frame.setAttribute('width', '100%');
          frame.setAttribute('height', '100%');

          element.innerHTML = '';
          element.appendChild(frame);

          return;
        } else {
          this.lightbox(id);
        }
      });
    });
  };

  lightbox = (id) => {
    document.body.classList.add('ytLight-active');

    const button = document.createElement('button');
    button.className = 'ytLight-close';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'close movie');

    const wrap = this.addClass('ytLight-wrap');
    const container = this.addClass('ytLight-container');
    const iframCointainer = this.addClass('ytLight-iframe');

    iframCointainer.appendChild(this.createIFrame(id));
    container.appendChild(iframCointainer);
    wrap.appendChild(container);

    iframCointainer.insertAdjacentElement('afterend', button);

    const lightboxDiv = this.addClass('ytLight is-open');
    lightboxDiv.setAttribute(
      'style',
      `background:${this.hex2rgb(this.background, this.opacity)}`
    );
    lightboxDiv.appendChild(wrap);

    document.body.appendChild(lightboxDiv);
  };
}

export default ytLazy;
