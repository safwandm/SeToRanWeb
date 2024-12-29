export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [0];

export const dictionary = {
		"/": [3],
		"/(layout)/dashboard": [4,[2]],
		"/(layout)/diskon": [5,[2]],
		"/(noLayout)/login": [12],
		"/(layout)/mitra": [6,[2]],
		"/(layout)/motor": [7,[2]],
		"/(layout)/pelanggan": [8,[2]],
		"/(layout)/pelanggan/[idPelanggan]": [9,[2]],
		"/(noLayout)/register": [13],
		"/(layout)/voucher": [10,[2]],
		"/(layout)/voucher/[voucherId]": [~11,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';