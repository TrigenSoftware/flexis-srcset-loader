import {
	groupBy,
	filterBy,
	toString
} from '../src/runtime';
import imgUrl, {
	src,
	srcSet,
	srcMap
} from './Felix.jpg';
import defaultImage from './Felix.jpg?commonjs';
import * as x2 from './Felix.jpg?width=1';
import * as x1 from './Felix.jpg?width=.5';
import * as w64 from './Felix.jpg?{ "width": 64, "format": "webp" }';
import './image.css';

function img(src, srcSet) {

	const srcSetString = !srcSet ? '' : toString(
		filterBy(srcSet, 'format', 'jpg')
	);
	const srcSetAttr = !srcSetString ? '' : ` srcset='${srcSetString}'`;

	return `<img${srcSetAttr} src='${src.url}' style="max-width: ${src.width}px">`;
}

function picture(src, srcSet) {

	const entries = groupBy(srcSet, 'type');

	return `<picture>
	${entries.map(([type, srcset]) =>
		`<source type='${type}' srcset='${toString(srcset)}'>`
	).join('\n')}
	${img(src, entries)}
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
		<li>
			<a href="?css">CSS</a>
		</li>
	</ul>
</nav>
${location.search !== '?img' ? '' : `<h2>Source image:</h2>
<figure>
	${img(src)}
</figure>`}
${location.search !== '?srcset' && location.search !== '' ? '' : `<h2>Source set:</h2>
<figure>
	${img(src, srcSet)}
</figure>`}
${location.search !== '?picture' ? '' : `<h2>Picture:</h2>
<figure>
	${picture(src, srcSet)}
</figure>`}
${location.search !== '?css' ? '' : `<h2>CSS:</h2>
<figure class="image"></figure>`}
`;

console.log(imgUrl, defaultImage, src, srcSet, srcMap);
console.log('x1', x1);
console.log('x2', x2);
console.log('w64', w64);
console.log('groupBy', groupBy(srcSet, 'type'));
console.log('filterBy', filterBy(srcSet, 'format', 'jpg'));
