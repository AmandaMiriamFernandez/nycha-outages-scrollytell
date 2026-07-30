import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Static adapter: builds this into plain HTML/CSS/JS for GitHub Pages.
		adapter: adapter(),
		paths: {
			// GitHub Pages serves project sites at username.github.io/repo-name,
			// so every link/asset needs that prefix in production. The deploy
			// workflow sets BASE_PATH; it's empty for local dev so `npm run dev`
			// still works at the site root.
			base: process.env.BASE_PATH ?? ''
		}
	}
};

export default config;
