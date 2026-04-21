// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { LikeC4VitePlugin } from 'likec4/vite-plugin'
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// ez csak a nagy gitre
	site:"https://unideb-advanced-software-engineering.github.io",
	base:"/26-tavasz-03-z-power/",
	vite:{
		plugins: [
     		LikeC4VitePlugin({}),
  		],
	},
    integrations: [starlight({
        title: 'Z-Power',
        social: [
            { icon: 'github', label: 'GitHub', href: 'https://github.com/unideb-advanced-software-engineering/26-tavasz-03-z-power' },
            { icon: 'astro', label: 'Eredeti esettanulmány', href: 'https://unideb-advanced-software-engineering.github.io/site/hu/scenarios/03-z-power/' },
        ],
        sidebar: [
            /*{
                label: 'Guides',
                items: [
                    // Each item here is one entry in the navigation menu.
                    { label: 'Example Guide', slug: 'guides/example' },
                ],
            },
            {
                label: 'Reference',
                autogenerate: { directory: 'reference' },
            },*/
            {
                label:"Esettanulmány",
                autogenerate: { directory: 'project' },
                collapsed: false
            },
            {
                label:"SRS",
                autogenerate: { directory: 'srs' },
                collapsed: true
            },
            {
                label:"Architektura",
                autogenerate: { directory: 'architecture' },
                collapsed: true
            },
            {
                label: "C4 Diagrammok",
                autogenerate: { directory: 'c4' },
                collapsed: true
            },
            {
                label:"Architekturális döntési jegyzőkönyv",
                autogenerate: { directory: 'adrs' },
                collapsed: true
            }

        ],
		}), 
		react()],
});