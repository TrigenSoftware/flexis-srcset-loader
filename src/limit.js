import {
	cpus
} from 'os';
import pLimit from 'p-limit';

const limitMap = new Map();

/**
 * Create limit instance from options.
 * @param {object} options
 * @param {Function} options.limit
 * @param {number} options.concurrency
 * @returns Limit instance.
 */
function createLimit({
	limit,
	concurrency
}) {
	return typeof limit === 'function'
		? limit
		: pLimit(concurrency || cpus().length);
}

/**
 * Get limit instance for options.
 * @param {object} options
 * @param {Function} options.limit
 * @param {number} options.concurrency
 * @returns Limit instance.
 */
export function get(options) {
	const {
		concurrency: id
	} = options;

	if (limitMap.has(id)) {
		return limitMap.get(id);
	}

	const limit = createLimit(options);

	limitMap.set(id, limit);

	return limit;
}
