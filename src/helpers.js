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

	let defaultExport = null;
	let withDefaultFormat = false;
	const srcsetStrings = [];
	const namesStrings = [];

	srcset.forEach(({
		format,
		type,
		name,
		width,
		height,
		src
	}) => {

		if (!withDefaultFormat && width === defaultWidth) {
			defaultExport = src;
			withDefaultFormat = format === defaultFormat;
		}

		srcsetStrings.push(`
	format: ${JSON.stringify(format)},
	type: ${JSON.stringify(type)},
	name: ${JSON.stringify(name)},
	width: ${width},
	height: ${height},
	src: ${src}
`);

		namesStrings.push(`${JSON.stringify(name)}: ${src}`);
	});

	return `
export default ${defaultExport};

export var srcset = [{${srcsetStrings.join('}, {')}}];

export var names = {
	${namesStrings.join(',\n\t')}
};
`;
}
