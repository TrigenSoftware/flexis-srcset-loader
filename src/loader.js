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
	getPaths,
	createModuleString,
	parseRequestOptions,
	createSrcObject
} from './utils';
import * as limit from './limit';
import * as runtimeModulesCache from './runtimeModulesCache';

function defaultResourceId(width, _, format) {
	return `${format}${width}`;
}

export async function loader(imageBuffer) {
	const callback = this.async();
	const {
		generator: Generator = SrcSetGenerator,
		generatorFactory,
		...inputOptions
	} = getOptions(this) || {};
	const requestOptions = parseRequestOptions(this.request);
	const options = {
		processing: false,
		optimization: false,
		skipOptimization: false,
		scalingUp: true,
		resourceId: defaultResourceId,
		rules: [{}],
		emitFile: true,
		limit: limit.get(inputOptions),
		...inputOptions,
		...requestOptions
	};
	const {
		emitFile,
		processOnce,
		rules
	} = options;
	const context = getContext(options, this);
	let cacheSetter = null;

	if (processOnce) {
		const cacheKey = this.request;

		runtimeModulesCache.validate(cacheKey, this, imageBuffer);

		if (runtimeModulesCache.has(cacheKey)) {
			runtimeModulesCache.bindCallback(cacheKey, callback);
			return;
		}

		cacheSetter = runtimeModulesCache.setAsync(cacheKey);
	}

	const generator = typeof generatorFactory === 'function'
		? generatorFactory(options)
		: new Generator(options);
	const isExternalMode = generator.mode === 'external';
	const imageSource = new Vinyl({
		path: this.resourcePath,
		contents: imageBuffer,
		url: ''
	});
	const srcSet = [];

	await attachMetadata(imageSource);

	if (isExternalMode) {
		const {
			publicPath
		} = getPaths(options, this, context, imageSource);

		if (!publicPath || !/^https?:\/\//.test(publicPath)) {
			throw new Error('For external mode `publicPath` must be full URL with protocol and hostname');
		}

		imageSource.url = publicPath;
	}

	const moduleExports = {
		format: imageSource.extname.replace('.', ''),
		width: imageSource.metadata.width,
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

					if (isExternalMode && image.url && !image.isNull()) {
						srcSet.push(createSrcObject(id, format, JSON.stringify(image.url), image));
						continue;
					}

					const {
						outputPath,
						jsPublicPath
					} = getPaths(options, this, context, image);

					srcSet.push(createSrcObject(id, format, jsPublicPath, image));

					if (emitFile) {
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

		const moduleString = createModuleString(
			moduleExports,
			srcSet
		);

		cacheSetter?.resolve(moduleString);
		callback(null, moduleString);
		return;
	} catch (err) {
		cacheSetter?.reject(err);
		callback(err);
	}
}
