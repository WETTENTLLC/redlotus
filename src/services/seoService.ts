/**
 * Comprehensive SEO Service for Red Lotus Music
 * Designed to make Red Lotus the #1 music artist search globally
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'music.album' | 'music.song' | 'profile' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  schema?: any;
}

export class SEOService {
  private static instance: SEOService;
  private baseUrl = 'https://redlotusofficial.com'; // Updated to the new domain
  
  // Core Red Lotus keywords for global dominance
  private coreKeywords = [
    'Red Lotus Music',
    'Red Lotus band',
    'Red Lotus artist',
    'Red Lotus official',
    'Red Lotus songs',
    'Red Lotus albums',
    'Red Lotus live shows',
    'Red Lotus tribe',
    'Red Lotus collective',
    'Red Lotus experience',
    'independent music artist',
    'music collective',
    'live music experience',
    'exclusive music content',
    'music community',
    'artist collective',
    'music tribe',
    'independent artist',
    'music platform',
    'exclusive artist content'
  ];

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  /**
   * Update page SEO dynamically
   */
  public updatePageSEO(config: SEOConfig): void {
    this.updateTitle(config.title);
    this.updateMetaDescription(config.description);
    this.updateMetaKeywords([...this.coreKeywords, ...config.keywords]);
    this.updateOpenGraph(config);
    this.updateTwitterCard(config);
    this.updateCanonicalUrl(config.url);
    
    if (config.schema) {
      this.updateStructuredData(config.schema);
    }
  }

  /**
   * Update page title with Red Lotus branding
   */
  private updateTitle(title: string): void {
    const brandedTitle = title.includes('Red Lotus') 
      ? title 
      : `${title} | Red Lotus Music - Official Site`;
    
    document.title = brandedTitle;
    this.updateMetaTag('property', 'og:title', brandedTitle);
    this.updateMetaTag('name', 'twitter:title', brandedTitle);
  }

  /**
   * Update meta description
   */
  private updateMetaDescription(description: string): void {
    this.updateMetaTag('name', 'description', description);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('name', 'twitter:description', description);
  }

  /**
   * Update meta keywords for search engine optimization
   */
  private updateMetaKeywords(keywords: string[]): void {
    const keywordString = [...new Set(keywords)].join(', ');
    this.updateMetaTag('name', 'keywords', keywordString);
  }

  /**
   * Update Open Graph meta tags for social media optimization
   */
  private updateOpenGraph(config: SEOConfig): void {
    this.updateMetaTag('property', 'og:type', config.type || 'website');
    this.updateMetaTag('property', 'og:site_name', 'Red Lotus Music');
    
    if (config.url) {
      this.updateMetaTag('property', 'og:url', `${this.baseUrl}${config.url}`);
    }
    
    if (config.image) {
      this.updateMetaTag('property', 'og:image', `${this.baseUrl}${config.image}`);
      this.updateMetaTag('property', 'og:image:alt', config.title);
      this.updateMetaTag('property', 'og:image:width', '1200');
      this.updateMetaTag('property', 'og:image:height', '630');
    }

    if (config.publishedTime) {
      this.updateMetaTag('property', 'article:published_time', config.publishedTime);
    }

    if (config.modifiedTime) {
      this.updateMetaTag('property', 'article:modified_time', config.modifiedTime);
    }

    if (config.author) {
      this.updateMetaTag('property', 'article:author', config.author);
    }

    if (config.section) {
      this.updateMetaTag('property', 'article:section', config.section);
    }

    if (config.tags) {
      config.tags.forEach(tag => {
        this.addMetaTag('property', 'article:tag', tag);
      });
    }
  }

  /**
   * Update Twitter Card meta tags
   */
  private updateTwitterCard(config: SEOConfig): void {
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:site', '@redlotusmusic'); // Update with actual Twitter handle
    this.updateMetaTag('name', 'twitter:creator', '@redlotusmusic');
    
    if (config.image) {
      this.updateMetaTag('name', 'twitter:image', `${this.baseUrl}${config.image}`);
    }
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url?: string): void {
    const canonicalUrl = url ? `${this.baseUrl}${url}` : this.baseUrl;
    
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }

  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(schema: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Helper method to update meta tags
   */
  private updateMetaTag(attribute: string, value: string, content: string): void {
    let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  /**
   * Helper method to add meta tags (for multiple tags with same property)
   */
  private addMetaTag(attribute: string, value: string, content: string): void {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    meta.content = content;
    document.head.appendChild(meta);
  }

  /**
   * Get page-specific SEO configurations
   */
  public getPageSEO(page: string): SEOConfig {
    const configs: { [key: string]: SEOConfig } = {
      home: {
        title: 'Red Lotus Music - Official Site | Independent Music Collective',
        description: 'Red Lotus Music - Experience the official music collective. Discover exclusive albums, join the tribe, attend live shows, and connect with an innovative independent artist community.',
        keywords: [
          'home page',
          'official website',
          'music homepage',
          'artist main page',
          'music discovery',
          'new music releases'
        ],
        image: '/og-image.png',
        url: '/',
        type: 'website',
        schema: this.getOrganizationSchema()
      },
      albums: {
        title: 'Red Lotus Albums - Official Music Releases & Discography',
        description: 'Explore Red Lotus official album collection. Stream and download exclusive music releases from the innovative independent music collective. Discover our complete discography.',
        keywords: [
          'discography',
          'music albums',
          'album releases',
          'streaming music',
          'download music',
          'music collection',
          'album art',
          'track listings'
        ],
        image: '/og-image.png',
        url: '/albums',
        type: 'website',
        schema: this.getMusicGroupSchema()
      },
      live: {
        title: 'Red Lotus Live Shows - Concert Dates & Live Music Events',
        description: 'Join Red Lotus live music experiences. Find upcoming concert dates, live show information, and exclusive live performance content. Experience the tribe in person.',
        keywords: [
          'live shows',
          'concerts',
          'live music',
          'concert dates',
          'music events',
          'live performances',
          'concert tickets',
          'music venues'
        ],
        image: '/og-image.png',
        url: '/live',
        type: 'website',
        schema: this.getEventSchema()
      },
      tribe: {
        title: 'Join the Red Lotus Tribe - Exclusive Music Community',
        description: 'Become part of the Red Lotus tribe. Access exclusive content, connect with fellow music lovers, and experience the community that celebrates independent music artistry.',
        keywords: [
          'music community',
          'fan community',
          'exclusive content',
          'music tribe',
          'artist community',
          'music fans',
          'member benefits',
          'community access'
        ],
        image: '/og-image.png',
        url: '/tribe',
        type: 'website'
      },
      about: {
        title: 'About Red Lotus Music - Independent Artist Collective Story',
        description: 'Learn about Red Lotus Music - the innovative independent music collective. Discover our story, mission, and the artists behind the experience.',
        keywords: [
          'about page',
          'artist biography',
          'music collective story',
          'independent artist',
          'artist background',
          'music mission',
          'band history'
        ],
        image: '/og-image.png',
        url: '/about',
        type: 'profile',
        schema: this.getPersonSchema()
      },
      login: {
        title: 'Red Lotus Login - Access Your Music Account',
        description: 'Login to your Red Lotus account. Access exclusive content, manage your tribe membership, and connect with the Red Lotus music community.',
        keywords: [
          'login',
          'account access',
          'member login',
          'user account',
          'tribe access',
          'exclusive access'
        ],
        image: '/og-image.png',
        url: '/login',
        type: 'website'
      }
    };

    return configs[page] || configs.home;
  }

  /**
   * Generate Organization structured data
   */
  private getOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      'name': 'Red Lotus Music',
      'alternateName': 'Red Lotus',
      'description': 'Independent music collective creating innovative and exclusive musical experiences.',
      'url': this.baseUrl,
      'sameAs': [
        // Add social media URLs when available
        'https://instagram.com/redlotusmusic',
        'https://twitter.com/redlotusmusic',
        'https://facebook.com/redlotusmusic',
        'https://youtube.com/redlotusmusic',
        'https://spotify.com/artist/redlotusmusic',
        'https://apple.com/artist/redlotusmusic'
      ],
      'logo': `${this.baseUrl}/og-image.png`,
      'image': `${this.baseUrl}/og-image.png`,
      'genre': ['Independent', 'Alternative', 'Electronic', 'Experimental'],
      'foundingDate': '2024', // Update with actual date
      '@id': `${this.baseUrl}#organization`
    };
  }

  /**
   * Generate MusicGroup structured data
   */
  private getMusicGroupSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      'name': 'Red Lotus Music',
      'genre': ['Independent', 'Alternative', 'Electronic', 'Experimental'],
      'url': this.baseUrl,
      'description': 'Independent music collective creating innovative and exclusive musical experiences.',
      'image': `${this.baseUrl}/og-image.png`,
      'sameAs': [
        'https://instagram.com/redlotusmusic',
        'https://twitter.com/redlotusmusic',
        'https://spotify.com/artist/redlotusmusic'
      ]
    };
  }

  /**
   * Generate Event structured data for live shows
   */
  private getEventSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      'name': 'Red Lotus Live Shows',
      'description': 'Live music performances by Red Lotus Music collective',
      'performer': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus Music',
        'url': this.baseUrl
      },
      'organizer': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus Music',
        'url': this.baseUrl
      }
    };
  }

  /**
   * Generate Person/Artist structured data
   */
  private getPersonSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Red Lotus Music',
      'jobTitle': 'Music Artist',
      'description': 'Independent music artist and collective creating innovative musical experiences.',
      'url': this.baseUrl,
      'image': `${this.baseUrl}/og-image.png`,
      'sameAs': [
        'https://instagram.com/redlotusmusic',
        'https://twitter.com/redlotusmusic',
        'https://spotify.com/artist/redlotusmusic'
      ],
      'knowsAbout': ['Music Production', 'Live Performance', 'Independent Music', 'Music Collective']
    };
  }

  /**
   * Generate album-specific structured data
   */
  public getAlbumSchema(album: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicAlbum',
      'name': album.title,
      'description': album.description || `${album.title} by Red Lotus Music`,
      'byArtist': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus Music',
        'url': this.baseUrl
      },
      'datePublished': album.releaseDate,
      'image': album.coverArt || `${this.baseUrl}/og-image.png`,
      'genre': album.genre || ['Independent', 'Alternative'],
      'recordLabel': 'Red Lotus Music',
      'numTracks': album.tracks?.length || 0,
      'url': `${this.baseUrl}/albums/${album.id}`
    };
  }

  /**
   * Generate event-specific structured data
   */
  public getEventSchemaForShow(show: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      'name': show.title || 'Red Lotus Live Show',
      'description': show.description || 'Live performance by Red Lotus Music',
      'startDate': show.date,
      'location': {
        '@type': 'Place',
        'name': show.venue || 'TBA',
        'address': show.location || 'TBA'
      },
      'performer': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus Music',
        'url': this.baseUrl
      },
      'organizer': {
        '@type': 'Organization',
        'name': 'Red Lotus Music',
        'url': this.baseUrl
      },
      'image': show.image || `${this.baseUrl}/og-image.png`,
      'url': `${this.baseUrl}/live/${show.id}`,
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode'
    };
  }
}

export default SEOService.getInstance();
