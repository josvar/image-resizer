# image-resizer

[![Latest Version on NPM](https://img.shields.io/npm/v/@josvar/image-resizer.svg?style=flat-square)](https://npmjs.com/package/image-resizer)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

Custom Cli for sharp image resizer

## Install

You can install the package via yarn:

```bash
$ npm i @josvar/image-resizer
```

## Usage

Create config file:
```bash
image-resizer init
```
Edit configuration file.

Resize images:
``` bash
image-resizer resize -c [./images.config.js] -i [./input] -o [./output] -p [default]
```

## Configuration
```javascript
module.exports = {
  presets: {
    default: {
      sizes: [600, 400, 200],
      name: '[n]-[w][e]',
      jpeg: {
        quality: 50,
      },
    },
  },
}
```

### Name tokens
- n : filename without extension
- b : filename
- e : extension, eg `.jpeg`, `.png`
- w : width (empty string if no present)
- h : height (empty string if no present)

### Sizes
- width resize: `[300, {w: 600}, 900, {w: 1200}, ...]`
- height resize: `[{h: 300}, {h: 600}, ...]`
- aspect ratio resize: `[{aspectRatio: '4:3', w: 600}, {aspectRatio: '5:2', w: 900}]`

### Jpeg Options
- quality (default 85)
- progressive (default true)
- other sharp jpeg params

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please contact Josue Vargas instead of using the issue tracker.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Credits

- [Josue Vargas](https://github.com/josvar)
- [All Contributors](../../contributors)
