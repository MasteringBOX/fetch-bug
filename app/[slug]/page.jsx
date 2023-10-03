export const dynamicParams = false;

async function getData() {
    const res = await fetch('https://www.masteringbox.com/api/wp/v2/posts?per_page=5&page=1') // This API call should be called only ONCE. TODO Change to your own API to check server access logs.

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
export async function generateStaticParams() {

    const posts = await getData(); // This is called at the beginning of the build.

    return posts.map(post => ({
        slug: post.slug
    }))
}

export default async function page({params: {slug}}) {

    const posts = await getData();
    /**
     *  This should always hit fetch cache in build.
     *  In 13.5.3 and Node 18.2.1 (Vercel version) the API gets called TWICE for every single page on build. I get one Fetch error per page. In a 5 SSG page build it gets called 11 times.
     *  In node 20.6.1 it is still called Twice per page on build but fetch error doesn't occur.
     *  In 13.4.3 works ok in local with Node 20.6.1 and Node 18.2.1. In Vercel it does 2 API calls instead of 1 (but not 11).
     *  In a more complex app, Vercel does a lot of unnecessary calls. You can check a project that is a little bit more complex https://github.com/MasteringBOX/fetch-cache-bug to showcase the issue.
     */

        // You can comment this out.
    const post = posts.find(post => post.slug === slug); // Filter post.
    return <div>{post.title.rendered}</div> // Show title.
}