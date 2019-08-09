interface ISrc {
	/**
	 * Image file format.
	 **/
	format: 'webp' | 'jpg' | 'png' | 'gif' | 'svg';
	/**
	 * Mime type of an image.
	 * Example: 'image/svg+xml', 'image/jpeg'...
	 **/
	type: string;
	/**
	 * Postfix, computed by loader.
	 * By default: `${format}${width}`
	 * Example: 'jpg320', 'webp1280'...
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
 * Example: `{ jpg320: 'image.jpg', webp1280: 'image.webp' }`
 **/
export type Names = Record<string, string>;
