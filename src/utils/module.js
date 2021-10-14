import {
	mimeTypes
} from './mimeTypes';

/**
 * @typedef {object} SrcObject
 * @property {string} id - Image id.
 * @property {string} format - Image format.
 * @property {string} type - Image type.
 * @property {number} width - Image width.
 * @property {number} height - Image height.
 * @property {number} originMultiplier - Origin image multiplier.
 * @property {string} url - Image url.
 */

/**
 * @typedef {object} ImageMetadata
 * @property {number} width - Image width.
 * @property {number} height - Image height.
 * @property {number} originMultiplier - Origin image multiplier.
 */

/**
 * @typedef {object} ImageFile
 * @property {ImageMetadata} metadata - Image metadata.
 * @property {string} extname - Image extension.
 * @property {string} postfix - Image postfix.
 * @property {Buffer} contents - Image buffer.
 */

/**
 * Create src object.
 * @param {string} id - Image id.
 * @param {string} format - Image file format.
 * @param {string} publicPath - Public path.
 * @param {ImageFile} image - Image file.
 * @returns {SrcObject} Src object.
 */
export function createSrcObject(id, format, publicPath, image) {
	return {
		id,
		format,
		type: mimeTypes[format],
		width: image.metadata.width,
		height: image.metadata.height,
		originMultiplier: image.metadata.originMultiplier,
		url: publicPath
	};
}

/**
 * Empty JSON string.
 */
const emptyString = JSON.stringify('');

/**
 * Get public path.
 * @param {object} defaultExport - Default export options.
 * @param {string} [defaultExport.format] - Default export format.
 * @param {number} [defaultExport.width] - Default export width.
 * @param {boolean} [defaultExport.commonjs] - Export with commonjs.
 * @param {string} [defaultExport.id] - Default export id.
 * @param {SrcObject[]} srcSet - Images.
 * @returns {string} Module string.
 */
export function createModuleString({
	id: defaultId,
	format: defaultFormat,
	width: defaultWidth,
	commonjs
}, srcSet) {
	let tmpSrcString = '';
	let tmpUrlString = '';
	let tmpIsDefaultSrcSet = false;
	let defaultExport = emptyString;
	let defaultSrcExportIndex = -1;
	let srcString = null;
	const srcSetStrings = [];
	const srcMapStrings = [];

	/**
	 * Find default export.
	 */
	srcSet.forEach(({
		id,
		format,
		width,
		originMultiplier,
		url
	}, i) => {
		if (
			id === defaultId
			|| (
				format === defaultFormat
				&& (
					(
						defaultWidth <= 1
						&& typeof originMultiplier === 'number'
						&& defaultWidth === originMultiplier
					)
					|| width === defaultWidth
				)
			)
		) {
			defaultExport = url;
			defaultSrcExportIndex = i;
		}
	});

	/**
	 * If no default export found, use first.
	 */
	if (defaultExport === emptyString && srcSet.length) {
		defaultExport = srcSet[0].url;
		defaultSrcExportIndex = 0;
	}

	/**
	 * CommonJS export.
	 */
	if (commonjs) {
		return `module.exports = ${defaultExport};`;
	}

	/**
	 * Build ES module exports.
	 */
	srcSet.forEach(({
		id,
		format,
		type,
		width,
		height,
		url
	}, i) => {
		tmpIsDefaultSrcSet = i === defaultSrcExportIndex;
		tmpUrlString = tmpIsDefaultSrcSet ? 'url' : url;
		tmpSrcString = `{
	id: ${JSON.stringify(id)},
	format: ${JSON.stringify(format)},
	type: ${JSON.stringify(type)},
	width: ${width},
	height: ${height},
	url: ${tmpUrlString}
}`;

		if (tmpIsDefaultSrcSet) {
			srcString = tmpSrcString;
		}

		srcMapStrings.push(`${JSON.stringify(id)}: ${tmpUrlString}`);
		srcSetStrings.push(tmpIsDefaultSrcSet ? 'src' : tmpSrcString);
	});

	return `
var url = ${defaultExport};

export default url;

export var src = ${srcString};

export var srcSet = [${srcSetStrings.join(', ')}];

export var srcMap = {
	${srcMapStrings.join(',\n\t')}
};
`;
}
