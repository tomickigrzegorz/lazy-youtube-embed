import {
  addClass,
  setAttr,
  parseJson,
  createIFrame,
  createRedButton,
} from './utils/function';

export default class ytLazy {
  private class: string;
  private background?: string;
  private opacity?: number;
  private overflow?: boolean;
  private overLayer: HTMLElement;
  private maxWidth?: number | null;
  private createWatchIn?: Function;
  private link: string;

  constructor(
    classElement: string,
    {
      background = '#000',
      opacity = 80,
      maxWidth = 90,
      overflow = false,
      createWatchIn = () => {},
    }: ConstructorObject
  ) {
    this.class = classElement;
    this.background = background;
    this.opacity = opacity;
    this.overflow = overflow;
    this.maxWidth = maxWidth;
    this.createWatchIn = createWatchIn;
    this.link = 'https://www.youtube.com';

    this.overLayer = addClass('div', 'ytLight');
    const overLayer = this.overLayer;
    document.body.appendChild(overLayer);

    this.initial();
  }

  initial = () => {
    const getYTLazy = document.querySelectorAll(`.${this.class}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      const { id, openIn } = parseJson(getYTLazy[i].getAttribute('data-yt'));

      setAttr(<HTMLElement>getYTLazy[i], {
        style: `background-image:url('//i.ytimg.com/vi/${id}/sddefault.jpg');`,
      });

      getYTLazy[i].appendChild(createRedButton());

      if (openIn && this.createWatchIn) {
        this.createWatchIn({
          link: this.link + '/watch?v=' + id,
          template: (template: string) => {
            getYTLazy[i].insertAdjacentHTML('beforeend', template);
          },
        });
      }
    }

    this.handEvent();
  };

  hex2rgb = (hex: string = '#000', opacity = 10) => {
    const c =
      typeof hex === 'string' ? parseInt(hex.replace('#', ''), 16) : hex;
    return `rgba(${c >> 16},${(c & 0xff00) >> 8},${c & 0xff},${opacity / 100})`;
  };

  setLbox = (target: HTMLElement) => {
    const watchIn = target.closest('.ytLazy__watch-in-link');
    if (watchIn) return;

    const element = target.closest('.ytLazy__item');

    if (element === null || element.className !== this.class) return;

    const { id, local, maxWidth } = parseJson(element.getAttribute('data-yt'));
    if (local) {
      const frame = createIFrame(id, this.link);
      setAttr(frame, {
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

    const button = addClass('button', 'ytLight-close');
    setAttr(button, {
      type: 'button',
      title: 'close movie',
    });

    const wrap = addClass('div', 'ytLight-wrap');
    const container = addClass('div', 'ytLight-container');

    (this.maxWidth || maxWidth) &&
      setAttr(container, {
        style: `max-width: ${maxWidth || this.maxWidth}%`,
      });

    const iframCointainer = addClass('div', 'ytLight-iframe');

    iframCointainer.appendChild(createIFrame(id, this.link));
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
