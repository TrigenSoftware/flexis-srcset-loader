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
 * @param {string} outputPath - Output path.
 * @returns {string} Public path.
 */
export function getPublicPath({
	publicPath
}, ctx, context, url, outputPath) {
	let resultPublicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

	if (publicPath) {
		if (typeof publicPath === 'function') {
			resultPublicPath = publicPath(url, ctx.resourcePath, context);
		} else {
			resultPublicPath = `${publicPath}${
				publicPath.endsWith('/')
					? ''
					: '/'
			}${url}`;
		}

		resultPublicPath = JSON.stringify(resultPublicPath);
	}

	return resultPublicPath;
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
