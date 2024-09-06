import { Octokit } from "@octokit/rest";

export const loader = async () => {
  const octokit = new Octokit();

  try {
    const { data } = await octokit.repos.getCommit({
      owner: "dodycode",
      repo: "remix-kdrama-tmdb",
      ref: "master",
    });

    let lastModified: string;

    if (data.commit && data.commit.committer && data.commit.committer.date) {
      lastModified = new Date(data.commit.committer.date).toISOString();
    } else {
      // Fallback to current date if committer data is not available
      lastModified = new Date().toISOString();
      console.warn("Committer data not available, using current date.");
    }

    const content = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://www.kdramadb.dodycode.com/</loc>
          <lastmod>${lastModified}</lastmod>
          <priority>1.0</priority>
        </url>
      </urlset>
    `;

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "xml-version": "1.0",
        encoding: "UTF-8",
      },
    });
  } catch (error) {
    console.error("Error fetching latest commit:", error);

    // Fallback to current date if there's an error
    const fallbackDate = new Date().toISOString();

    const content = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://www.kdramadb.dodycode.com/</loc>
          <lastmod>${fallbackDate}</lastmod>
          <priority>1.0</priority>
        </url>
      </urlset>
    `;

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "xml-version": "1.0",
        encoding: "UTF-8",
      },
    });
  }
};
