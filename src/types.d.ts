/**
 * Image info.
 */
export type Src = {
	/**
	 * Id, computed with `resourceId` option.
	 * By default: `${format}${width}`
	 * Example: 'jpg320', 'webp1280'...
	 **/
	id: string;
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
	url: string;
}

/**
 * Image url.
 */
export type Url = Src['url'];

/**
 * SrcSet list.
 */
export type SrcSet = Src[];

/**
 * id-to-url map.
 * Example: `{ jpg320: 'image.jpg', webp1280: 'image.webp' }`
 **/
export type SrcMap = Record<string, string>;
