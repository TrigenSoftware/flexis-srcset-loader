import {
	interpolateName
} from 'loader-utils';

const cacheMap = new Map();
const validationCacheMap = new Map();

/**
 * Validate cache.
 * @param {string} key - Cache key.
 * @param {object} ctx - Loader this context.
 * @param {Buffer} content - File content.
 */
export function validate(key, ctx, content) {
	if (!ctx._compiler.watchMode) {
		return;
	}

	const contenthash = interpolateName(ctx, `[contenthash]`, {
		content
	});

	if (!validationCacheMap.has(key)) {
		validationCacheMap.set(key, contenthash);
	} else
	if (validationCacheMap.get(key) !== contenthash) {
		validationCacheMap.set(key, contenthash);
		cacheMap.delete(key);
	}
}

/**
 * Create async setter for cache key.
 * @param {string} key - Cache key.
 * @returns {object} resolve and reject methods.
 */
export function setAsync(key) {
	let methods = null;

	cacheMap.set(key, new Promise((resolve, reject) => {
		methods = {
			resolve,
			reject
		};
	}));

	return methods;
}

/**
 * Cache key exists or not.
 * @param {string} key - Cache key.
 * @returns {boolean} Exist or not.
 */
export function has(key) {
	return cacheMap.has(key);
}

/**
 * Bind cache value resolve to callback.
 * @param {string} key - Cache key.
 * @param {(err: Error, result: any) => void} callback - Callback function.
 */
export async function bindCallback(key, callback) {
	try {
		callback(null, await cacheMap.get(key));
	} catch (err) {
		callback(err);
	}
}

