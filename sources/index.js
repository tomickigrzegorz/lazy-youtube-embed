import './style.scss';

class ytLazy {
  constructor(classElement, options = {}) {
    // { backgroundColor, opacity }
    this.className = classElement;
    this.backgroundColor = options.backgroundColor || '#000';
    this.opacity = options.opacity || 90;
    this.ytRender();
  }

  ytRender() {
    let getYTLazy = document.querySelectorAll(`.${this.className}`);
    for (let i = 0; i < getYTLazy.length; i++) {
      let ytId = getYTLazy[i].getAttribute('data-yt-id');
      let ytType = getYTLazy[i].getAttribute('data-yt-type');
      let dataYType = document.querySelector(`div[data-yt-id="${ytId}"]`);
      const imgType = this.ytImageType(parseFloat(ytType));

      dataYType.setAttribute('style', `background-image: url('//i.ytimg.com/vi/${ytId}/${imgType}'); background-repeat:no-repeat; background-size: cover; background-position: center;`);

      getYTLazy[i].innerHTML = this.ytButton();
    }
    this.ytTrigger();
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
  ytImageType(type) {
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

  ytHexToRgb(hex, alpha) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return alpha ? `rgba(${r},${g},${b},${alpha / 100})` : `rgb(${r},${g},${b})`;
  };

  ytButton() {
    return ` 
      <div class="ytLazy__thumbnail">
        <div class="ytLazy__img">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="ytLazy__img--svg" viewBox="0 0 32 32">
            <path d="M31.327 8.273a4.026 4.026 0 0 0-2.756-2.777l-.028-.007c-2.493-.668-12.528-.668-12.528-.668s-10.009-.013-12.528.668A4.026 4.026 0 0 0 .71 8.245l-.007.028C.26 10.554.007 13.176.007 15.858v.163-.008.126c0 2.682.253 5.304.737 7.845l-.041-.26a4.026 4.026 0 0 0 2.756 2.777l.028.007c2.491.669 12.528.669 12.528.669s10.008 0 12.528-.669a4.026 4.026 0 0 0 2.777-2.756l.007-.028c.425-2.233.668-4.803.668-7.429l-.001-.297v.015l.001-.31c0-2.626-.243-5.196-.708-7.687l.04.258zM12.812 20.801V11.21l8.352 4.803z" />
          </svg>
        </div>
      </div>
    `;
  }

  ytTrigger() {
    let getYTLazy = document.querySelectorAll(`.${this.className}`);

    for (let i = 0; i < getYTLazy.length; i++) {
      getYTLazy[i].addEventListener('click', event => {
        event.preventDefault();
        const ytId = getYTLazy[i].getAttribute('data-yt-id');
        const ytPlay = getYTLazy[i].getAttribute('data-play');
        this.ytLightbox(ytId, ytPlay === 'true' ? '?autoplay=1' : '');
      })
    }
  }

  ytLightbox(ytId, ytPlay) {
    console.log(`www.youtube.com/embed/${ytId}?autoplay=1&volume=0`);
    const imgFile = `
      <div class="ytLight-wrap">
        <div class="ytLight-container">
            <div class="ytLight-iframe">
              <iframe src="//www.youtube.com/embed/${ytId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
            </div>
            <button type="button" class="ytLight-close" title="Close">×</button>
        </div>
      </div>
    `;
    const lightboxDiv = document.createElement('div');
    lightboxDiv.setAttribute('class', 'ytLight');
    lightboxDiv.setAttribute('style', `background: ${this.ytHexToRgb(this.backgroundColor, this.opacity)}`)
    setTimeout(() => lightboxDiv.classList.add('is-open'), 1);
    lightboxDiv.innerHTML = imgFile;
    document.body.appendChild(lightboxDiv);

    this.ytLightboxClose();
  }

  ytLightboxClose() {
    const ytLight = document.querySelector('.ytLight');
    window.addEventListener('keydown', event => {
      if (event.keyCode === 27) {
        ytLight.parentNode.removeChild(ytLight);
      }
    });
    document.querySelector('.ytLight-close').addEventListener('click', event => {
      event.stopPropagation();
      ytLight.parentNode.removeChild(ytLight);
    });

  }

}


export default ytLazy;