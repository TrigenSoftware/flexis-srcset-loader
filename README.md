# @flexis/srcset-loader

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependencies status][peer-deps]][peer-deps-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/@flexis/srcset-loader.svg
[npm-url]: https://npmjs.com/package/@flexis/srcset-loader

[node]: https://img.shields.io/node/v/@flexis/srcset-loader.svg
[node-url]: https://nodejs.org

[peer-deps]: https://david-dm.org/TrigenSoftware/flexis-srcset-loader/peer-status.svg
[peer-deps-url]: https://david-dm.org/TrigenSoftware/flexis-srcset-loader?type=peer

[deps]: https://david-dm.org/TrigenSoftware/flexis-srcset-loader.svg
[deps-url]: https://david-dm.org/TrigenSoftware/flexis-srcset-loader

[build]: http://img.shields.io/travis/com/TrigenSoftware/flexis-srcset-loader/master.svg
[build-url]: https://travis-ci.com/TrigenSoftware/flexis-srcset-loader

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/flexis-srcset-loader
[dependabot-url]: https://dependabot.com/

Highly customizable loader for generating responsive images.

- [Responsive images](https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) 🌠
- Optimize images with [imagemin](https://www.npmjs.com/package/imagemin) 🗜
- Convert images to [modern formats such as WebP](https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Use_modern_image_formats_boldly) 📸

## Install

```bash
npm i -D @flexis/srcset-loader
# or
yarn add -D @flexis/srcset-loader
```

## Usage example

JavaScript:

```js
import {
    groupBy,
    filterBy,
    toString
} from '@flexis/srcset-loader/runtime';
import url, {
    src,
    srcSet,
    srcMap
} from './image.jpg';
```

CSS:

```css
.image {
    background-image: url('./image.jpg');
}

.webp .image {
    background-image: url('./image.jpg?{ "format": "webp" }');
}

.image.sm {
    background-image: url('./image.jpg?{ "width": 320 }');
}
```

## Description

### `Src` object

| Option | Type | Description |
|--------|------|-------------|
| id | string | Id, computed with `resourceId` option. |
| format | 'webp' \| 'jpg' \| 'png' \| 'gif' \| 'svg' | Image file format. |
| type | string | Mime type of image. |
| width | number | Image width. |
| height | number | Image height. |
| url | string | Image url. |

### Loader exports

| Option | Type | Description |
|--------|------|-------------|
| default | string | Source image url. |
| src | [Src](#src-object) | Source image. |
| srcSet | [Src](#src-object)\[\] | Generated images. |
| srcMap | Record\<string, string\> | Id-to-url map. |

### Runtime exports

Located in `@flexis/srcset-loader/runtime`.

| Option | Type | Description |
|--------|------|-------------|
| groupBy | (srcSet: [Src](#src-object)\[\], field: string) => \[string, [Src](#src-object)\[\]\]\[\] | Group images by field. |
| filterBy | (srcSet: [Src](#src-object)\[\], field: string, value: any) => [Src](#src-object)\[\] | Filter images by field value. |
| toString | (srcSet: [Src](#src-object)\[\]) => string | Make `srcset` attribute string. |

### Query parameters

With @flexis/srcset-loader you can add query parameters to image imports. Examples:

Generate image with given rule:

```js
import url from './image.jpg?{ "width": [1, 0.5], "format": ["webp", "jpg"] }';
```

Select default exportable image variant:

```js
import url from './image.jpg?width=320';
```

Select default exportable image from given rule:

```js
import url from './image.jpg?width=0.5&{ "width": [1, 0.5], "format": ["webp", "jpg"] }';
```

Use commonjs exports:

```js
const url = require('./image.jpg?commonjs');
```

## Configuration

Example:

```js
module.exports = {
    module:  {
        rules: [{
            test: /\.jpe?g$/,
            use:  {
                loader:  '@flexis/srcset-loader',
                options: {
                    rules: [{
                        match:  '(max-width: 3000px)',
                        width:  [1, 1920, 1280, 720, 560, 320],
                        format: ['webp', 'jpg']
                    }],
                    scalingUp: false
                }
            }
        }]
    }
}
```

### Common options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| processing | Partial\<[IProcessingConfig]\> | Object with Sharp configs for each supported format. | see [defaults.ts] |
| optimization | Partial\<[IOptimizationConfig]\> | Object with imagemin plugins for each format. | see [defaults.ts] |
| skipOptimization | boolean | Do not optimize output images. | `false` |
| scalingUp | boolean | Generate images with higher resolution than they's sources are. | `true` |
| postfix | [Postfix] | Postfix string or function to generate postfix for image. | see [defaults.ts] |

### Rule options

Extends [common options](#common-options).

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| match | [Matcher] | There is support of 3 types of matchers:<br>1. Glob pattern of file path;<br>2. Media query to match image by size;<br>3. `(path: string, size: ISize, source: Vinyl) => boolean` function. | all images |
| format | [SupportedExtension]\|[SupportedExtension]\[\] | Output image(s) formats to convert. | no convert |
| width | number\|number[] | Output image(s) widths to resize, value less than or equal to 1 will be detected as multiplier. | `[1]` |

### Loader options

Extends [common options](#common-options).

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| name | string\|Function | See [file-loader docs](https://github.com/webpack-contrib/file-loader#name) |  |
| outputPath | string\|Function | See [file-loader docs](https://github.com/webpack-contrib/file-loader#outputpath) | |
| publicPath | string\|Function |See [file-loader docs](https://github.com/webpack-contrib/file-loader#publicpath) | |
| context | string | See [file-loader docs](https://github.com/webpack-contrib/file-loader#context) | |
| emitFile | boolean | See [file-loader docs](https://github.com/webpack-contrib/file-loader#emitfile) | |
| regExp | RegExp | See [file-loader docs](https://github.com/webpack-contrib/file-loader#regexp) | |
| resourceId | [Postfix] | Function to generate id for image. | ```(width, _, format) => `${format}${width}` ``` |
| rules | [IRule](#rule-options)\[\] | Rules. | `[]` |
| exports | object | Default exported image description.<br>Also you can pass it through query parameters.<br>Example: `background-image: url(./image.jpg?width=320&format=webp);` | `{}` |
| exports.width | number | Width to match image. | |
| exports.format | 'webp' \| 'jpg' \| 'png' \| 'gif' \| 'svg' | Format to match image. | |
| exports.commonjs | boolean | Use CommonJS exports.<br>Notice: Vue doesn't support ES6 exports with loaders, so you should set this prop to `true`. | `false` |

[defaults.ts]: https://github.com/TrigenSoftware/flexis-srcset/tree/master/src/defaults.ts
[IProcessingConfig]: https://trigensoftware.github.io/flexis-srcset/interfaces/_types_.iprocessingconfig.html
[IOptimizationConfig]: https://trigensoftware.github.io/flexis-srcset/interfaces/_types_.ioptimizationconfig.html
[Postfix]: https://trigensoftware.github.io/flexis-srcset/modules/_types_.html#postfix
[Matcher]: https://trigensoftware.github.io/flexis-srcset/modules/_helpers_.html#matcher
[SupportedExtension]: https://trigensoftware.github.io/flexis-srcset/modules/_extensions_.html#supportedextension

## Using with TypeScript

Add it to your `globals.d.ts`:

```ts
declare module '*.jpg' {
    const url: import('@flexis/srcset-loader/types').Url;
    const src: import('@flexis/srcset-loader/types').Src;
    const srcSet: import('@flexis/srcset-loader/types').SrcSet;
    const srcMap: import('@flexis/srcset-loader/types').SrcMap;
    export default url;
    export {
        src,
        srcSet,
        srcMap
    };
}
```
