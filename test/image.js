import imageSrc, {
	srcset as imageSrcset,
	names as imageNames
} from './image.jpg';

function img(src, srcset) {

	const srcsetString = !srcset ? '' : srcset
		.map(({
			format,
			src,
			width
		}) => (format !== 'jpg' ? null : `${src} ${width}w`))
		.filter(Boolean)
		.join(',\n');
	const srcsetAttr = !srcsetString ? '' : ` srcset='${srcsetString}'`;

	return `<img${srcsetAttr} src='${src}'>`;
}

function picture(src, srcset) {

	const types = {};

	srcset.forEach(({
		type,
		src,
		width
	}) => {

		if (!types[type]) {
			types[type] = [];
		}

		const srcQuery = `${src} ${width}w`;

		types[type].push(srcQuery);
	});

	return `<picture>
	${Object.entries(types).map(([type, srcset]) =>
		`<source type='${type}' srcset='${srcset.join(',\n')}'>`
	).join('\n')}
	${img(src, srcset)}
</picture>`;
}

/* eslint-disable no-undef */

document.body.innerHTML = `
<style>

figure {
	margin: 0;
}

img {
	width: 100%;
}

</style>
<nav>
	<ul>
		<li>
			<a href="?img">Source image</a>
		</li>
		<li>
			<a href="?srcset">Source set</a>
		</li>
		<li>
			<a href="?picture">Picture</a>
		</li>
	</ul>
</nav>
${location.search !== '?img' ? '' : `<h2>Source image:</h2>
<figure>
	${img(imageSrc)}
</figure>`}
${location.search !== '?srcset' && location.search !== '' ? '' : `<h2>Source set:</h2>
<figure>
	${img(imageSrc, imageSrcset)}
</figure>`}
${location.search !== '?picture' ? '' : `<h2>Picture:</h2>
<figure>
	${picture(imageSrc, imageSrcset)}
</figure>`}
`;

console.log(imageNames);
