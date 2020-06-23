import {
	SrcSet
} from './types.d';

/**
 * Group sources set by field.
 * @param srcSet - Sources set.
 * @param field - Field name to group by.
 * @returns Group entries.
 */
export function groupBy(srcSet: SrcSet, field: string): [string, SrcSet][];

/**
 * Filter sources set by field value.
 * @param srcSet - Sources set.
 * @param field - Field name to filter by.
 * @param value - Field value to group by.
 * @returns Group entries.
 */
export function filterBy(srcSet: SrcSet, field: string, value: any): SrcSet;

/**
 * Make `srcset` attribute string.
 * @param srcSet - Sources set.
 * @returns `srcset` attribute string.
 */
export function toString(srcSet: SrcSet): string;
