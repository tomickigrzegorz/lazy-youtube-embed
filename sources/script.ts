interface ConstructorObject {
  background?: string;
  opacity?: number;
  overflow?: boolean;
  maxWidth?: number | null;
}

class ytLazy {
  private class: string;
  private background?: string;
  private opacity?: number;
  private overflow?: boolean;
  private overLayer: HTMLElement;
  private maxWidth?: number | null;

  constructor(
    classElement: string,
    {
      background = '#000',
      opacity = 80,
      maxWidth = 90,
      overflow = false,
    }: ConstructorObject
  ) {
    this.class = classElement;
    this.background = background;
    this.opacity = opacity;
    this.overflow = overflow;
    this.maxWidth = maxWidth;

    this.overLayer = this.addClass('div', 'ytLight');
    const overLayer = this.overLayer;
    document.body.appendChild(overLayer);

    this.initial();
  }

  initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this.class}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const { id } = this.parseJson(getYTLazy[i].getAttribute('data-yt'));

      this.setAttr(<HTMLElement>getYTLazy[i], {
        style: `background-image:url('//i.ytimg.com/vi/${id}/sddefault.jpg');`,
      });

      getYTLazy[i].appendChild(this.crBtn());
    }

    this.handEvent();
  };

  parseJson = (object: any) => JSON.parse(object);

  hex2rgb = (hex: string = '#000', opacity = 10) => {
    const c =
      typeof hex === 'string' ? parseInt(hex.replace('#', ''), 16) : hex;
    return `rgba(${c >> 16},${(c & 0xff00) >> 8},${c & 0xff},${opacity / 100})`;
  };

  addClass = (type: string, name: string) => {
    const element = document.createElement(type);
    element.className = name;
    return element;
  };

  crBtn = () => {
    const buttonW = this.addClass('div', 'ytLazy__thumbnail');
    const buttonS = this.addClass('div', 'ytLazy__img ytLazy__img--svg');

    buttonW.appendChild(buttonS);
    return buttonW;
  };

  setAttr = (el: HTMLElement, attrs: any) => {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };

  crIFrame = (id: string) => {
    const iframe = this.addClass('iframe', '');
    this.setAttr(iframe, {
      frameborder: '0',
      allowfullscreen: 'true',
      allow:
        'accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;',
      src: `https://www.youtube.com/embed/${id}?autoplay=1`,
    });

    return iframe;
  };

  setLbox = (target: HTMLElement) => {
    const element = target.closest('.ytLazy__item');

    if (element === null || element.className !== this.class) return;

    const { id, local, maxWidth } = this.parseJson(
      element.getAttribute('data-yt')
    );
    if (local) {
      const frame = this.crIFrame(id);
      this.setAttr(frame, {
        width: '100%',
        height: '100%',
      });

      element.innerHTML = '';
      element.appendChild(frame);

      return;
    } else {
      this.lightbox({ id, maxWidth });
    }
  };

  closeLbox = () => {
    const isOpen = document.querySelector('.is-open');
    if (isOpen === null) return;
    isOpen.innerHTML = '';
    isOpen.classList.remove('is-open');
    if (this.overflow) {
      document.body.classList.remove('ytLight-active');
    }
  };

  handClick = (event: Event) => {
    event.stopPropagation();
    const { target } = event;

    this.closeLbox();
    this.setLbox(<HTMLElement>target);
  };

  handKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    this.setLbox(<HTMLElement>event.target);
    this.closeLbox();
  };

  handEvent = () => {
    window.addEventListener('click', this.handClick);
    window.addEventListener('keydown', this.handKey);
  };

  lightbox = ({ id, maxWidth }: { id: string; maxWidth: string }) => {
    if (this.overflow) {
      document.body.classList.add('ytLight-active');
    }

    const button = this.addClass('button', 'ytLight-close');
    this.setAttr(button, {
      type: 'button',
      title: 'close movie',
    });

    const wrap = this.addClass('div', 'ytLight-wrap');
    const container = this.addClass('div', 'ytLight-container');

    (this.maxWidth || maxWidth) &&
      this.setAttr(container, {
        style: `max-width: ${maxWidth || this.maxWidth}%`,
      });

    const iframCointainer = this.addClass('div', 'ytLight-iframe');

    iframCointainer.appendChild(this.crIFrame(id));
    container.appendChild(iframCointainer);
    wrap.appendChild(container);

    iframCointainer.insertAdjacentElement('afterend', button);

    const overlay = this.overLayer;
    overlay.appendChild(wrap);
    overlay.classList.add('is-open');
    overlay.setAttribute(
      'style',
      `background:${this.hex2rgb(this.background, this.opacity)}`
    );
  };
}

export default ytLazy;
