import {
	combineVariants,
	cuncurrentIterator
} from '@flexis/srcset';

export default class CustomGenerator {
	async *generate(source, config) {
		const variants = combineVariants({
			type: [].concat(config.format),
			width: [].concat(config.width)
		});

		yield *cuncurrentIterator(variants, async function *g({
			type,
			width
		}) {
			const image = {
				url: `"imgproxy/${width}.${type}"`,
				extname: type,
				metadata: source.metadata,
				isNull: () => false
			};

			yield image;
		});
	}
}
