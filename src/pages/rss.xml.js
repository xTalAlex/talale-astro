import rss from '@astrojs/rss';
import Config from '../site_config.json';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const projects = await getCollection('projects');
    projects.sort((a,b) => (a.data.pubDate < b.data.pubDate) ? 1 : ((b.data.pubDate < a.data.pubDate) ? -1 : 0));

    return rss({
        title: Config.title,
        description: Config.motto,
        site: context.site,
        items: projects.map((project) => ({
            //required fields
            link: project.data.link,
            title: project.data.title,
            pubDate: project.data.pubDate,
            //optional fields
            description: project.data.description,
            //content: project.data.content,
            //customData : project.data.customData,
        })),
        customData: `<language>it</language>`,
        stylesheet: '/rss/pretty-feed-v3.xsl',
    });
}