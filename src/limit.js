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
 * @returns Limit instance.
 */
export function get(options) {
	if (limitMap.has(options)) {
		return limitMap.get(options);
	}

	const limit = createLimit(options);

	limitMap.set(options, limit);

	return limit;
}
