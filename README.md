 <h1 align="center">
  Lazy loading youtube
 </h1>

<p align="center">
  Lazy loading youtube on lightbox
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/lazy-youtube">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
</p>

<p align="center">
  <img src="static/01.png">
</p>

## Demo
See the demo - [example](https://tomik23.github.io/lazy-youtube/)

thumbnail name | data-yt-type | size (px)
---- | :-------: | :-------
player Background | 1 | 480x360
start | 2 | 120x90
middle | 3 | 120x90
end | 4 | 120x90
high quality | 5 | 480x360
medium quality | 6 | 320x180
normal quality | 0 | 120x90

> close the lightbox by pressing the ESC key

## HTML configuration

```
// class needed to run the whole process
ytLazy__item

// thumbnail size
data-yt-type

// video number
data-yt-id
```

HTML
```html
<div class="ytLazy__item" data-yt-type="5" data-yt-id="8fuafBkKqTc"></div>

<script src="./youtubeLazy.min.js"></script>
<script>
  // options are optional
  const options = {
    // color in hex, default black - #000000
    backgroundColor: '#383838',
    // lightbox opcity, [10, 20, ...], max is 100
    // default: 90
    opacity: 90
  };

  // ytLazy__item youtube class div
  document.addEventListener('DOMContentLoaded', new ytLazy('ytLazy__item', options));
  // or without options
  document.addEventListener('DOMContentLoaded', new ytLazy('ytLazy__item'));
</script>
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions