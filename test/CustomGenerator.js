import {
	combineVariants,
	cuncurrentIterator
} from '@flexis/srcset';

export default class CustomGenerator {
	constructor() {
		this.mode = 'external';
	}

	async *generate(source, config) {
		const variants = combineVariants({
			type: [].concat(config.format),
			width: [].concat(config.width)
		});

		yield *cuncurrentIterator(variants, async function *g({
			type
		}) {
			const image = {
				url: source.url,
				extname: type,
				metadata: source.metadata,
				isNull: () => true
			};

			yield image;
		});
	}
}
