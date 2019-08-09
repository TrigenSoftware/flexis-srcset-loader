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
 * Source image url.
 */
export type Src = string;

/**
 * Source image info.
 */
export type Source = ISrc;

/**
 * Srcset list.
 */
export type Srcset = ISrc[];

/**
 * Name-to-url map.
 * e.g: `{ jpg320: 'image.jpg', webp1280: 'image.webp' }`
 **/
export type Names = Record<string, string>;
