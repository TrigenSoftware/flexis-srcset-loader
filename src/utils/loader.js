/* eslint-disable valid-jsdoc */
import path from 'path';
import {
	interpolateName
} from 'loader-utils';

/**
 * @typedef {import('./module').ImageFile} ImageFile
 */

/**
 * Filename postfix placeholder.
 */
const postfixPlaceholder = '[postfix]';

/**
 * Generate resource id.
 * @param {object} options - Loader options,
 * @param {(width: number, mul: number, format: string) => string} options.resourceId - Id format function.
 * @param {ImageFile} image - Image file.
 * @param {string} format - Image file format.
 * @returns {string} Resource id.
 */
export function getResourceId(options, image, format) {
	const {
		resourceId
	} = options;
	const {
		width,
		originMultiplier
	} = image.metadata;

	return resourceId(
		width,
		typeof originMultiplier === 'number'
			? originMultiplier
			: width,
		format
	);
}

/**
 * Get context directory path.
 * @param {object} options - Loader options.
 * @param {string} [options.context] - Context option.
 * @param {object} ctx - Loader this context.
 * @param {string} [ctx.rootContext] - Loader root context.
 * @returns {string} Context.
 */
export function getContext(options, ctx) {
	return options.context
		|| ctx.rootContext;
}

/**
 * Get image url.
 * @param {object} options - Loader options.
 * @param {string} [options.name] - Output file name.
 * @param {RegExp} [options.regExp] - Capture groups.
 * @param {object} ctx - Loader this context.
 * @param {string} context - File directory path.
 * @param {ImageFile} image - Image file.
 * @returns {string} Url.
 */
export function getUrl({
	name,
	regExp
}, ctx, context, image) {
	const {
		extname,
		postfix
	} = image;
	let url = typeof name === 'string'
		? name.replace(postfixPlaceholder, postfix)
		: name;

	url = interpolateName(ctx, url, {
		content: image.contents,
		context,
		regExp
	});

	url = url.replace(
		path.extname(url),
		extname
	);

	return url;
}

/**
 * Get output path.
 * @param {object} options - Loader options.
 * @param {string} [options.outputPath] - Output path option.
 * @param {object} ctx - Loader this context.
 * @param {string} context - File directory path.
 * @param {string} url - Image url.
 * @returns {string} Output path.
 */
export function getOutputPath({
	outputPath
}, ctx, context, url) {
	let resultOutputPath = url;

	if (outputPath) {
		if (typeof outputPath === 'function') {
			resultOutputPath = outputPath(url, ctx.resourcePath, context);
		} else {
			resultOutputPath = path.posix.join(outputPath, url);
		}
	}

	return resultOutputPath;
}

/**
 * Get public path.
 * @param {object} options - Loader options.
 * @param {string} [options.publicPath] - Public path option.
 * @param {object} ctx - Loader this context.
 * @param {string} context - File directory path.
 * @param {string} url - Image url.
 * @returns {string} Public path.
 */
export function getPublicPath({
	publicPath
}, ctx, context, url) {
	if (!publicPath) {
		return null;
	}

	if (typeof publicPath === 'function') {
		return publicPath(url, ctx.resourcePath, context);
	}

	return `${publicPath}${
		publicPath.endsWith('/')
			? ''
			: '/'
	}${url}`;
}

/**
 * Get public path as js.
 * @param {string} [publicPath] - Public path.
 * @param {string} outputPath - Output path.
 * @returns {string} Public path as js.
 */
export function getJsPublicPath(publicPath, outputPath) {
	return publicPath
		? JSON.stringify(publicPath)
		: `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
}

/**
 * Get output and public paths.
 * @param {object} options - Loader options.
 * @param {string} [options.outputPath] - Output path option.
 * @param {string} [options.publicPath] - Public path option.
 * @param {object} ctx - Loader this context.
 * @param {string} context - File directory path.
 * @param {ImageFile} image - Image file.
 * @returns {{ outputPath: string, publicPath: string }} Output and public paths.
 */
export function getPaths(options, ctx, context, image) {
	const url = getUrl(options, ctx, context, image);
	const outputPath = getOutputPath(options, ctx, context, url);
	const publicPath = getPublicPath(options, ctx, context, url);
	const jsPublicPath = getJsPublicPath(publicPath, outputPath);

	return {
		outputPath,
		publicPath,
		jsPublicPath
	};
}

/**
 * Parse options from request.
 * @param {string} request - Loader request.
 * @returns {object} Parsed options.
 */
export function parseRequestOptions(request) {
	if (typeof request !== 'string' || !request) {
		return {};
	}

	const filePart = request.split('!').pop();

	if (!filePart) {
		return {};
	}

	const optionsPart = filePart.split('?').pop();
	const options = optionsPart.split('&').reduce((options, pair) => {
		if (pair[0] === '{') {
			options.rules = [
				JSON.parse(pair)
			];
			return options;
		}

		const [
			key,
			value
		] = pair.split('=');

		switch (key) {
			case 'id':
				options.exports = {
					...options.exports,
					id: value
				};
				break;

			case 'width':
				options.exports = {
					...options.exports,
					width: Number(value)
				};
				break;

			case 'format':
				options.exports = {
					...options.exports,
					format: value
				};
				break;

			case 'commonjs':
				options.exports = {
					...options.exports,
					commonjs: typeof value === 'undefined' || value === 'true'
				};
				break;

			default:
		}

		return options;
	}, {});

	return options;
}

/**
 * Validating that URL is full and has protocol.
 * @param {string} url - URL.
 * @returns {boolean} Is full URL.
 */
export function isFullUrl(url) {
	return url && /^https?:\/\//.test(url);
}

/**
 * Attach external url to image file.
 * @param {object} options - Loader options.
 * @param {string} [options.outputPath] - Output path option.
 * @param {string} [options.publicPath] - Public path option.
 * @param {object} ctx - Loader this context.
 * @param {string} context - File directory path.
 * @param {ImageFile} image - Image file.
 */
export function attachExternalUrl(options, ctx, context, image) {
	const {
		publicPath
	} = getPaths(options, ctx, context, image);

	if (!isFullUrl(publicPath)) {
		throw new Error('For external mode `publicPath` must be full URL with protocol and hostname');
	}

	image.url = publicPath;
}
