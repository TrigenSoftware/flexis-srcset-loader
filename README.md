# @flexis/srcset-loader

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependency status][deps]][deps-url]
[![Build status][build]][build-url]
[![Greenkeeper badge][greenkeeper]][greenkeeper-url]

[npm]: https://img.shields.io/npm/v/%40flexis/srcset-loader.svg
[npm-url]: https://www.npmjs.com/package/@flexis/srcset-loader

[node]: https://img.shields.io/node/v/%40flexis/srcset-loader.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/TrigenSoftware/flexis-srcset-loader.svg
[deps-url]: https://david-dm.org/TrigenSoftware/flexis-srcset-loader

[build]: http://img.shields.io/travis/TrigenSoftware/flexis-srcset-loader.svg
[build-url]: https://travis-ci.org/TrigenSoftware/flexis-srcset-loader

[greenkeeper]: https://badges.greenkeeper.io/TrigenSoftware/flexis-srcset-loader.svg
[greenkeeper-url]: https://greenkeeper.io/

Highly customizable loader to generating responsive images.

## Install

```bash
npm i -D @flexis/srcset-loader
# or
yarn add -D @flexis/srcset-loader
```

## Usage

Import (or require) the target file(s) in one of the bundle's files:

```js
import imgSrc {
    srcset as imgSrcset,
    names as imgNames
} from './file.jpg'
```

Typings for "srcset"-modules:

```ts
declare module '*.jpg' {
    
    interface ISrc {
        /**
         * Image file format.
         * e.g. 'jpg', 'svg', 'png'...
         **/
        format: string;
        /**
         * Mime type of an image.
         * e.g. 'image/svg+xml', 'image/jpeg'...
         **/
        type: string;
        /**
         * Postfix, computed by `srcset`.
         * By default: `${format}${width}`
         * e.g: 'jpg320', 'webp1280'...
         **/
        name: string;
        /**
         * Image width.
         **/
        width: number;
        /**
         * Image height.
         **/
        height: number;
        /**
         * Image url.
         **/
        src: string;
    }

    /**
     * Name-to-url map.
     * e.g: `{ jpg320: 'image.jpg', webp1280: 'image.webp' }`
     **/
    interface INames {
        [name: string]: string;
    }

    const defaultSrc: string;

    export default defaultSrc;

    export const srcset: ISrc[];
    export const names: INames;
}
```

Then add the loader to your webpack config. For example:

```js
module.exports = {
    module:  {
        rules: [{
            test: /\.jpe?g$/,
            use:  {
                loader:  '@flexis/srcset-loader',
                options: {
                    rules: [{
                        match:  '(min-width: 3000px)',
                        width:  [1, 3200, 1920, 1280, 720, 560, 320],
                        format: ['webp', 'jpg']
                    }]
                }
            }
        }]
    }
}
```

## Loader options

Same as [`file-loader` options](https://github.com/webpack-contrib/file-loader#options).

## Srcset options

### `rules: object[]`

Array of rules to generate variants of image.

#### `rule.match: string|Function|(String|Function)[]`

There is support of 3 types of matchers:

1. Glob pattern of file path/name.
2. Media query to match image by size.
3. Function with `path`, `size` and `file` arguments, where `path` is String, `size` is object `{ width, height }` and `file` is instance of `Vinyl`.

#### `rule.width: number|number[]`

Target widths to generate, value less or equal 1 will be detected as multiplier.

`gulp-srsset` supports SVG, GIF, JPEG, PNG and WebP, but only last 3 formats available to resize.

Default: `[1]`

#### `rule.format: string|string[]`

Target formats to generate, supports: `"svg"`, `"gif"`, `"jpeg"`, `"png"` and `"webp"`.

For converting are available only `"jpeg"`, `"png"` and `"webp"`.

Default: ```[`format of source image`]```

#### `rule.postfix`

Same as [`postfix` option](#postfix-calculatedwidth-number-width-number-format-string--string).

#### `rule.processing`

Same as [`processing` option](#processing-object).

#### `rule.optimization`

Same as [`optimization` option](#optimization-object).

#### `rule.skipOptimization`

Same as [`skipOptimization` option](#skipoptimization-boolean).

#### `rule.scalingUp`

Same as [`scalingUp` option](#scalingup-boolean).

### `postfix: (calculatedWidth: number, width: number, format: string) => string`

Function to generate postfix for file name.

Default: ```(width, mul, format) => `${format}${width}` ```

### `processing: object`

Object with [Sharp configs](http://sharp.readthedocs.io/en/stable/api-output/) for each supported format. Sharp used as tool for resizing and converting images.

Default:
```js
{
    webp: {
        quality: 100
    },
    jpg: {
        quality: 100
    },
    png: {}
}
```

### `optimization: object`

Object with [imagemin](https://www.npmjs.com/package/imagemin) plugins for each format. Imagemin used as tool for images optimization.

Default:
```js
{
    webp: webpPlugin({
        quality: 100
    }),
    jpg:  mozJpegPlugin({
        quality: 100
    }),
    png:  zopfliPlugin(),
    gif:  gifLossyPlugin(),
    svg:  svgoPlugin()
}
```

### `skipOptimization: boolean`

Option to skip optimization.

Default: `false`

#### `scalingUp: boolean`

Generate or not images with higher width than they's sources are.

Default: `true`
