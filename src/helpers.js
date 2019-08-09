import path from 'path';
import loaderUtils from 'loader-utils';

export function getContext(options, ctx) {
	return options.context
		|| ctx.rootContext;
}

export function getUrl({
	name,
	regExp
}, ctx, context, image) {

	const url = loaderUtils.interpolateName(ctx, name, {
		content: image.contents,
		context,
		regExp
	});

	return url.replace(
		path.extname(url),
		image.extname
	);
}

export function getOutputPath({
	outputPath
}, ctx, context, url) {

	let resultOutputPath = url;

	if (outputPath) {

		if (typeof outputPath === 'function') {
			resultOutputPath = outputPath(url, ctx.resourcePath, context);
		} else {
			resultOutputPath = path.posix.join(outputPath, url);
		}
	}

	return resultOutputPath;
}

export function getPublicPath({
	publicPath
}, ctx, context, url, outputPath) {

	let resultPublicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

	if (publicPath) {

		if (typeof publicPath === 'function') {
			resultPublicPath = publicPath(url, ctx.resourcePath, context);
		} else {
			resultPublicPath = `${publicPath}${
				publicPath.endsWith('/')
					? ''
					: '/'
			}${url}`;
		}

		resultPublicPath = JSON.stringify(resultPublicPath);
	}

	return resultPublicPath;
}

export function createModuleString(defaultFormat, defaultWidth, srcset) {

	let defaultExport = JSON.stringify('');
	let defaultSrcExportIndex = -1;
	let defaultSrcExport = null;
	let withDefaultFormat = false;
	let srcsetString = '';
	const srcsetStrings = [];
	const namesStrings = [];

	srcset.forEach(({
		format,
		type,
		name,
		width,
		height,
		src
	}, i) => {

		srcsetString = `{
	format: ${JSON.stringify(format)},
	type: ${JSON.stringify(type)},
	name: ${JSON.stringify(name)},
	width: ${width},
	height: ${height},
	src: ${src}
}`;

		namesStrings.push(`${JSON.stringify(name)}: ${src}`);

		if (!withDefaultFormat && width === defaultWidth) {

			if (defaultSrcExport) {
				srcsetStrings[defaultSrcExportIndex] = defaultSrcExport;
			}

			defaultExport = src;
			defaultSrcExport = srcsetString;
			defaultSrcExportIndex = i;
			withDefaultFormat = format === defaultFormat;

			srcsetStrings.push('source');
			return;
		}

		srcsetStrings.push(srcsetString);
	});

	return `
export default ${defaultExport};

export var source = ${defaultSrcExport};

export var srcset = [${srcsetStrings.join(', ')}];

export var names = {
	${namesStrings.join(',\n\t')}
};
`;
}

export function parseRequestOptions(request) {

	if (typeof request !== 'string' || !request) {
		return {};
	}

	const filePart = request.split('!').pop();

	if (!filePart) {
		return {};
	}

	const optionsPart = filePart.split('?').pop();
	const options = optionsPart.split('&').reduce((options, pair) => {

		const [
			key,
			value
		] = pair.split('=');

		switch (key) {

			case 'width':
				options.width = Number(value);
				break;

			case 'format':
				options.format = value;
				break;

			default:
		}

		return options;
	}, {});

	return options;
}
