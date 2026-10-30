import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const osSchema = z.enum(['Linux', 'Windows', 'Outro', 'linux', 'windows', 'outro'])
  .transform((value) => (value[0].toUpperCase() + value.slice(1)) as 'Linux' | 'Windows' | 'Outro');

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    platform: z.string(),
    category: z.enum(['starting-point', 'machines']),
    tier: z.enum(['0', '1', '2']).optional(),
    os: osSchema,
    difficulty: z.string(),
    status: z.enum(['draft', 'published']),
    tags: z.array(z.string()),
    techniques: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }).superRefine((entry, ctx) => {
    if (entry.category === 'starting-point' && !entry.tier) {
      ctx.addIssue({ code: 'custom', path: ['tier'], message: 'Starting Point exige um tier.' });
    }
    if (entry.category === 'machines' && entry.tier) {
      ctx.addIssue({ code: 'custom', path: ['tier'], message: 'Machines não deve definir tier.' });
    }
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(['conceitos', 'ferramentas']),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { writeups, notes };
