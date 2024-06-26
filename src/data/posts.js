import Config from "@config/general.json";
const API_URL = Config.blog.url + "/graphql";

async function fetchAPI(query, { variables } = {}) {
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error("!Errore WP GraphQL: " + json.errors[0].message);
  }
  return json.data;
}

async function getPosts() {
  const data = await fetchAPI(`
    {
        posts(first: 50, where: {categoryName: "${Config.blog.category}"}) {
          nodes {
            id
            title
            slug
            link
            date
            excerpt
            content
            featuredImage {
              node {
                sourceUrl
                title
                altText
              }
            }
          }
        }
    }
    `);
  return data?.posts;
}

const data = await getPosts();
const posts = data.nodes.map((post) => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    link: post.link,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage.node,
  };
});

export { posts };
