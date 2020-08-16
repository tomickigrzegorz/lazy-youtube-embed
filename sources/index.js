class ytLazy {
  constructor(classElement, options = {}) {
    this.className = classElement;
    this.backgroundColor = options.backgroundColor === 'undefined' ? options.backgroundColor : '#000000';
    this.opacity = options.opacity === 'undefined' ? options.opacity : 90;

    this.divElement = document.createElement('div');
    this.button = document.createElement('button');
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('frameborder', '0');
    this.iframe.setAttribute('allowfullscreen', '');
    this.iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');

    this.initial();
  }

  initial() {
    this.getYTLazy = document.querySelectorAll(`.${this.className}`);

    for (let i = 0; i < this.getYTLazy.length; i++) {

      const { type, id, local } = this.parseJson(this.getYTLazy[i].getAttribute('data-yt'));

      this.type = type;
      this.id = id;
      this.local = local || false;

      this.imgType = this.imageType(this.type);

      this.getYTLazy[i].setAttribute('style', `background-image: url('//i.ytimg.com/vi/${this.id}/${this.imgType}'); background-repeat:no-repeat; background-size: cover; background-position: center;`);

      this.getYTLazy[i].appendChild(this.createButtonYoutube());
    }
  }

  parseJson(object) {
    return JSON.parse(object);
  }

  /*
  | Thumbnail Name      | Size (px) | URL                                              |
  |---------------------|-----------|--------------------------------------------------|
  | Player Background   | 480x360   | https://i1.ytimg.com/vi/<VIDEO ID>/0.jpg         |
  | Start               | 120x90    | https://i1.ytimg.com/vi/<VIDEO ID>/1.jpg         |
  | Middle              | 120x90    | https://i1.ytimg.com/vi/<VIDEO ID>/2.jpg         |
  | End                 | 120x90    | https://i1.ytimg.com/vi/<VIDEO ID>/3.jpg         |
  | High Quality        | 480x360   | https://i1.ytimg.com/vi/<VIDEO ID>/hqdefault.jpg |
  | Medium Quality      | 320x180   | https://i1.ytimg.com/vi/<VIDEO ID>/mqdefault.jpg |
  | Normal Quality      | 120x90    | https://i1.ytimg.com/vi/<VIDEO ID>/default.jpg   |
  */
  imageType(type) {
    let imgType = '';
    switch (type) {
      case 0:
        imgType = 'default.jpg';
        break;
      case 1:
        imgType = '0.jpg';
        break;
      case 2:
        imgType = '1.jpg';
        break;
      case 3:
        imgType = '2.jpg';
        break;
      case 4:
        imgType = '3.jpg';
        break;
      case 5:
        imgType = 'hqdefault.jpg';
        break;
      case 6:
        imgType = 'mqdefault.jpg';
        break;
    }
    return imgType;
  }

  convertHexToRgb(hex, alpha) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return alpha ? `rgba(${r},${g},${b},${alpha / 100})` : `rgb(${r},${g},${b})`;
  };

  createButtonYoutube() {
    const buttonW = this.divElement.cloneNode();
    buttonW.className = 'ytLazy__thumbnail';

    const buttonS = this.divElement.cloneNode();
    buttonS.classList.add('ytLazy__img');
    buttonS.classList.add('ytLazy__img--svg');

    buttonW.appendChild(buttonS);
    return buttonW;
  }

  createFrame(id) {
    const frame = this.iframe.cloneNode();
    // frame.src = `//www.youtube.com/embed/${id}`;
    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1`;

    return frame;
  }

  handleEvent() {
    document.body.addEventListener('click', event => {
      event.preventDefault();
      const { target } = event;
      const element = target.closest('.ytLazy__item');

      if (target.className === 'ytLight-close' || target.className === 'ytLight-wrap') {
        this.isOpen = document.querySelector('.is-open');
        this.removeLightbox(this.isOpen);
      }

      if (element === null || (element.className !== this.className)) return;

      const { id, local } = this.parseJson(element.getAttribute('data-yt'));

      if (local) {
        const frame = this.createFrame(id);
        frame.setAttribute('width', '100%');
        frame.setAttribute('height', '100%');

        element.innerHTML = '';
        element.appendChild(frame);
        return;
      } else {
        this.lightbox(id);
      }
    });

    window.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.keyCode === 27) {
        this.isOpen = document.querySelector('.is-open');
        if (this.isOpen === null) return;
        this.removeLightbox(this.isOpen);
      }
    });

  }

  removeLightbox(element) {
    element.parentNode.removeChild(element);
  }

  lightbox(id) {
    const button = this.button.cloneNode();
    button.className = 'ytLight-close';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'close movie');

    const wrap = this.divElement.cloneNode();
    wrap.className = 'ytLight-wrap';

    const container = this.divElement.cloneNode();
    container.className = 'ytLight-container';

    const iframCointainer = this.divElement.cloneNode();
    iframCointainer.className = 'ytLight-iframe';

    iframCointainer.appendChild(this.createFrame(id));

    container.appendChild(iframCointainer);
    wrap.appendChild(container);

    iframCointainer.insertAdjacentElement('afterend', button);


    const lightboxDiv = this.divElement.cloneNode();
    lightboxDiv.classList.add('ytLight');
    lightboxDiv.classList.add('is-open');
    lightboxDiv.setAttribute('style', `background: ${this.convertHexToRgb(this.backgroundColor, this.opacity)}`)
    lightboxDiv.appendChild(wrap);

    document.body.appendChild(lightboxDiv);
  }

}

export default ytLazy;