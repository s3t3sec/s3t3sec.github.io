// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://s3t3sec.github.io',
  integrations: [mdx()],
  redirects: {
    '/writeups/': '/write-ups/',
    '/writeups/hack-the-box/': '/write-ups/',
    '/writeups/hack-the-box/starting-point/': '/write-ups/starting-point/',
    '/writeups/hack-the-box/starting-point/tier-0/': '/write-ups/starting-point/tier-0/',
    '/writeups/hack-the-box/starting-point/tier-1/': '/write-ups/starting-point/tier-1/',
    '/writeups/hack-the-box/starting-point/tier-2/': '/write-ups/starting-point/tier-2/',
    '/writeups/hack-the-box/machines/': '/write-ups/machines/',
    '/writeups/[...slug]': '/write-ups/[...slug]',
  },
});
