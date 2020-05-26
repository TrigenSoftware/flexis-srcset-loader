import Vinyl from 'vinyl';
import SrcsetGenerator, {
	attachMetadata,
	matchImage
} from '@flexis/srcset';
import {
	getOptions
} from 'loader-utils';
import {
	getContext,
	getUrl,
	getOutputPath,
	getPublicPath,
	createModuleString,
	parseRequestOptions
} from './helpers';
import mimeTypes from './mimeTypes';

function defaultPostfix(width, mul, format) {
	return `${format}${width}`;
}

export default async function loader(imageBuffer) {

	const callback = this.async();
	const inputOptions = getOptions(this) || {};
	const requestOptions = parseRequestOptions(this.request);
	const options = {
		processing:       false,
		optimization:     false,
		skipOptimization: false,
		scalingUp:        true,
		postfix:          defaultPostfix,
		rules:            [{}],
		...inputOptions
	};
	const {
		emitFile,
		rules
	} = options;
	const context = getContext(options, this);
	const generator = new SrcsetGenerator(options);
	const imageSource = new Vinyl({
		contents: imageBuffer
	});
	const srcset = [];

	await attachMetadata(imageSource);

	const moduleExports = {
		format:  imageSource.extname.replace('.', ''),
		width:   imageSource.metadata.width,
		default: false,
		...options.exports,
		...requestOptions
	};

	try {

		await Promise.all(
			rules.map(async (rule) => {

				const matches = await matchImage(imageSource, rule.match);

				if (matches) {

					const images = generator.generate(imageSource, rule);

					for await (const image of images) {

						const url = getUrl(options, this, context, image);
						const outputPath = getOutputPath(options, this, context, url);
						const publicPath = getPublicPath(options, this, context, url, outputPath);
						const format = image.extname.replace('.', '');

						srcset.push({
							format,
							type:   mimeTypes[format],
							name:   image.postfix,
							width:  image.metadata.width,
							height: image.metadata.height,
							src:    publicPath
						});

						if (emitFile !== false) {
							this.emitFile(outputPath, image.contents);
						}
					}

					return true;
				}

				return false;
			})
		);

		callback(null, createModuleString(
			moduleExports.format,
			moduleExports.width,
			moduleExports.default,
			srcset
		));
		return;

	} catch (err) {
		callback(err);
		return;
	}
}

export const raw = true;
