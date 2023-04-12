import rss from '@astrojs/rss';
import Config from '../site_config.json';
import { getCollection } from 'astro:content';

export async function get(context) {
    // getCollection('nomeCartellaInPages')
    const blog = await getCollection('blog');
    return rss({
        title: Config.title,
        description: Config.description,
        site: context.site,
        items: blog.map((project) => ({
            //required fields
            link: `/projects/${project.slug}/`,
            title: project.data.title,
            pubDate: project.data.pubDate,
            //optional fields
            description: project.data.description,
            //content: project.data.content,
            //customData: project.data.customData,      
        })),
        customData: `<language>it</language>`,
        stylesheet: '/rss/pretty-feed-v3.xsl',
    });
}