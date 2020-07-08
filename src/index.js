import Vinyl from 'vinyl';
import SrcSetGenerator, {
	attachMetadata,
	matchImage
} from '@flexis/srcset';
import {
	getOptions
} from 'loader-utils';
import {
	getContext,
	getResourceId,
	getUrl,
	getOutputPath,
	getPublicPath,
	createModuleString,
	parseRequestOptions
} from './helpers';
import mimeTypes from './mimeTypes';

function defaultResourceId(width, _, format) {
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
		resourceId:       defaultResourceId,
		rules:            [{}],
		...inputOptions,
		...requestOptions
	};
	const {
		emitFile,
		rules
	} = options;
	const context = getContext(options, this);
	const generator = new SrcSetGenerator(options);
	const imageSource = new Vinyl({
		path:     this.resourcePath,
		contents: imageBuffer
	});
	const srcSet = [];

	await attachMetadata(imageSource);

	const moduleExports = {
		format:   imageSource.extname.replace('.', ''),
		width:    imageSource.metadata.width,
		commonjs: false
	};
	let moduleExportsFromRule = null;

	try {

		for (const rule of rules) {

			const matches = await matchImage(imageSource, rule.match);

			if (matches) {

				const images = generator.generate(imageSource, rule);

				for await (const image of images) {

					const format = image.extname.replace('.', '');
					const id = getResourceId({
						...options,
						...rule
					}, image, format);
					const url = getUrl(options, this, context, image);
					const outputPath = getOutputPath(options, this, context, url);
					const publicPath = getPublicPath(options, this, context, url, outputPath);

					srcSet.push({
						id,
						format,
						type:             mimeTypes[format],
						width:            image.metadata.width,
						height:           image.metadata.height,
						originMultiplier: image.metadata.originMultiplier,
						url:              publicPath
					});

					if (emitFile !== false) {
						this.emitFile(outputPath, image.contents);
					}
				}

				if (typeof rule.exports === 'object') {
					moduleExportsFromRule = rule.exports;
				}

				if (rule.only) {
					break;
				}
			}
		}

		Object.assign(
			moduleExports,
			inputOptions.exports,
			moduleExportsFromRule,
			requestOptions.exports
		);

		callback(null, createModuleString(
			moduleExports,
			srcSet
		));
		return;

	} catch (err) {
		callback(err);
		return;
	}
}

export const raw = true;
