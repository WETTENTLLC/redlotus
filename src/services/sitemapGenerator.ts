/**
 * Sitemap Generator for Red Lotus Music
 * Generates XML sitemap for optimal search engine indexing
 */

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl = 'https://redlotusofficial.com'; // Updated with new domain
  
  /**
   * Generate complete sitemap XML
   */
  public generateSitemap(albums?: any[], shows?: any[]): string {
    const urls: SitemapURL[] = [
      // Core pages with high priority
      {
        loc: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: '/albums',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: '/live',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: '/tribe',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: '/about',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      }
    ];

    // Add album pages
    if (albums) {
      albums.forEach(album => {
        urls.push({
          loc: `/albums/${album.id}`,
          lastmod: album.updatedAt || album.createdAt || new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8
        });
      });
    }

    // Add live show pages
    if (shows) {
      shows.forEach(show => {
        urls.push({
          loc: `/live/${show.id}`,
          lastmod: show.updatedAt || show.createdAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7
        });
      });
    }

    return this.generateXML(urls);
  }

  /**
   * Generate XML from URL array
   */
  private generateXML(urls: SitemapURL[]): string {
    const urlElements = urls.map(url => `
    <url>
      <loc>${this.baseUrl}${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
  }

  /**
   * Generate news sitemap for fresh content
   */
  public generateNewsSitemap(articles?: any[]): string {
    if (!articles || articles.length === 0) return '';

    const newsItems = articles.map(article => `
    <url>
      <loc>${this.baseUrl}${article.url}</loc>
      <news:news>
        <news:publication>
          <news:name>Red Lotus Music</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${article.publishedAt}</news:publication_date>
        <news:title>${this.escapeXML(article.title)}</news:title>
        <news:keywords>${article.keywords || 'Red Lotus, music, artist, independent'}</news:keywords>
      </news:news>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsItems}
</urlset>`;
  }

  /**
   * Generate image sitemap
   */
  public generateImageSitemap(images?: any[]): string {
    if (!images || images.length === 0) return '';

    const imageItems = images.map(image => `
    <url>
      <loc>${this.baseUrl}${image.pageUrl}</loc>
      <image:image>
        <image:loc>${this.baseUrl}${image.imageUrl}</image:loc>
        <image:title>${this.escapeXML(image.title)}</image:title>
        <image:caption>${this.escapeXML(image.caption || '')}</image:caption>
      </image:image>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${imageItems}
</urlset>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export default new SitemapGenerator();
