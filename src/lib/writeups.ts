import { getCollection } from 'astro:content';
import { upcomingWriteups } from '../data/writeups';

export async function getUpcomingWriteups() {
  const entries = await getCollection('writeups');
  const images = new Map(entries.map(({ data }) => [data.title.toLowerCase(), { image: data.image, imageAlt: data.imageAlt }]));
  const publishedTitles = new Set(entries.filter(({ data }) => data.status === 'published').map(({ data }) => data.title.toLowerCase()));
  return upcomingWriteups
    .filter((entry) => !publishedTitles.has(entry.title.toLowerCase()))
    .map((entry) => ({ ...entry, ...images.get(entry.title.toLowerCase()) }));
}

export async function getPublishedWriteups() {
  const entries = await getCollection('writeups', ({ data }) => data.status === 'published');
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPublishedWriteupCards() {
  const entries = await getPublishedWriteups();
  return entries.map(({ id, data }) => ({
    title: data.title,
    os: data.os,
    category: data.category === 'starting-point' ? 'Starting Point' : 'Machines',
    tier: data.tier ? `Tier ${data.tier}` : undefined,
    techniques: data.techniques,
    summary: data.description,
    number: upcomingWriteups.find((entry) => entry.title.toLowerCase() === data.title.toLowerCase())?.number,
    image: data.image,
    imageAlt: data.imageAlt,
    href: `/write-ups/${id}/`,
    status: 'published' as const,
  }));
}
