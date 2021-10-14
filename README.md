 <h1 align="center">
  Lazy loading youtube
 </h1>

<p align="center">
  Lazy loading youtube on lightbox
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/lazy-youtube">
  <img src="https://img.shields.io/github/size/tomik23/lazy-youtube/docs/youtubeLazy.min.js">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
</p>

<p align="center">
  <img src="static/01.png">
</p>

## Demo

See the demo - [example](https://tomik23.github.io/lazy-youtube/)

> close the lightbox by pressing the ESC key

## How to configure it?

### First, add CSS

```HTML
<link rel="stylesheet" href="./youtubeLazy.min.css">
```

### Add a div with the appropriate json

- **"id": "TUIbj4mviXU"** - id is the id of the movie you can find it in every youtube link
- **"local": true** - parameter that tells the library that the movie should play in the same div as the thumbnail, not in the lightbox
- **"maxWidth": 50** - the video opens to the given width, it is a percentage, in this example 50%, if there is no number then the video opens to the whole window - 100%. You can also set a global `maxWidth` for all videos that open in the lightbox. Just add the same `maxWidth: 80` parameter to option, see the example below

```html
<div class="ytLazy__item" data-yt='{ "id":"TUIbj4mviXU" }'></div>
<div class="ytLazy__item" data-yt='{ "id":"XHeDps0fX6c", "local": true }'></div>
<!-- set max-width -->
<div class="ytLazy__item" data-yt='{ "id":"XHeDps0fX6c", "maxWidth": 50 }'></div>
```

### Add a library, configuration options that are not required and call the library

```html
<script src="./youtubeLazy.min.js"></script>

<script>
  // options are optional
  const options = {
    // color in hex, default black - #000
    background: '#383838',
    // lightbox opcity, [10, 20, ...], max is 100
    // default: 80
    opacity: 90,

    // global setting for the width of
    // the displayed movie as a percentage
    // default 90%
    maxWidth: 80

    // hide overflow to body
    // when open lightbox
    // default false
    overflow: true,
  };

  // ytLazy__item youtube class div with options
  document.addEventListener('DOMContentLoaded',new ytLazy('ytLazy__item', options));
  // or without options
  document.addEventListener('DOMContentLoaded', new ytLazy('ytLazy__item'));
</script>
```

## IE10+

If you need IE support, add this pollyfil to html

```html
<script type="text/javascript">
  if (window.Element && !Element.prototype.closest) {
    var script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=Element.prototype.closest';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
</script>
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, IE11, Edge                                                                                                                                                                                                | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           | last 2 versions                                                                                                                                                                                                   |
