/**
 * @typedef {import('./types.d').SrcSet} SrcSet
 */

/**
 * Group images by field.
 * @param {SrcSet} srcSet - Sources set.
 * @param {string} field - Field name to group by.
 * @returns {[string, SrcSet][]} Group entries.
 */
export function groupBy(srcSet, field) {
	const map = {};
	let tmpSrcSetGroup = null;
	let tmpValue = null;

	return srcSet.reduce((entries, src) => {
		tmpValue = src[field];

		if (tmpValue in map) {
			map[tmpValue].push(src);
		} else {
			tmpSrcSetGroup = [src];

			entries.push([tmpValue, tmpSrcSetGroup]);

			map[tmpValue] = tmpSrcSetGroup;
		}

		return entries;
	}, []);
}

/**
 * Filter images by field value.
 * @param {SrcSet} srcSet - Sources set.
 * @param {string} field - Field name to filter by.
 * @param {any} value - Field value to group by.
 * @returns {SrcSet} Group entries.
 */
export function filterBy(srcSet, field, value) {
	return srcSet.filter(
		src => src[field] === value
	);
}

/**
 * Make `srcset` attribute string.
 * @param {SrcSet} srcSet - Sources set.
 * @returns {string} `srcset` attribute string.
 */
export function toString(srcSet) {
	return srcSet.length > 1
		? srcSet
			.map(({
				url,
				width
			}) => `${url} ${width}w`)
			.join(', ')
		: srcSet.length > 0
			? srcSet[0].url
			: '';
}
