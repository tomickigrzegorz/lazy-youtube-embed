## Lazy loading youtube

Demo <https://tomik23.github.io/lazy-youtube/>

thumbnail name | data-yt-type | size (px)
---- | :-------: | :-------
player Background | 1 | 480x360
start | 2 | 120x90
middle | 3 | 120x90
end | 4 | 120x90
high quality | 5 | 480x360
medium quality | 6 | 320x180
normal quality | 0 | 120x90

## HTML configuration

```
// class needed to run the whole process
ytLazy__item

// thumbnail size
data-yt-type

// video number
data-yt-id
```

```html
<div class="ytLazy__item" data-yt-type="5" data-yt-id="8fuafBkKqTc"></div>
```

```html
<script src="./youtubeLazy.min.js"></script>
<script>
  const options = {
    className: 'ytLazy__item'
  };
  document.addEventListener('DOMContentLoaded', new ytLazy(options));
</script>
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions