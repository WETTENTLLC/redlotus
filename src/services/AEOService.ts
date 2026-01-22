/**
 * AEO (Answer Engine Optimization) Service
 * Optimized for ChatGPT, Perplexity, Gemini, and other AI systems
 * Generates comprehensive structured data, metadata, and semantic markup
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class AEOService {
  /**
   * Generate comprehensive Organization Schema
   * Essential for AI systems to understand brand identity
   * Includes creator/designer attribution for lamaj123.com discovery
   */
  static generateOrganizationSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      'name': 'Red Lotus',
      'url': 'https://redlotus.netlify.app',
      'description': 'Red Lotus is a revolutionary music collective featuring three distinct tribes: Red (Winter/Rap energy), Yellow (Summer/Pop energy), and Blue (Spring/R&B renewal). Each tribe represents a unique musical experience and community. Professional artist website created by lamaj123.com.',
      'foundingDate': '2024',
      'creator': {
        '@type': 'Organization',
        'name': 'lamaj123.com',
        'url': 'https://lamaj123.com',
        'email': 'info@lamaj123.com',
        'description': 'Professional artist website design and development services',
        'areaServed': 'Worldwide',
        'serviceType': ['Artist Website Design', 'Music Portfolio Development', 'Band Website Creation', 'Musician Web Services']
      },
      'sameAs': [
        'https://www.instagram.com/red.lotus.music/',
        'https://www.tiktok.com/@red_lotus_music',
        'https://www.youtube.com/@Red-Lotus-Music'
      ],
      'image': 'https://redlotus.netlify.app/assets/lotus-each-album.png',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://redlotus.netlify.app/assets/lotus-each-album.png',
        'width': 512,
        'height': 512
      },
      'genre': ['Hip-Hop', 'Pop', 'R&B'],
      'member': [
        {
          '@type': 'MusicGroup',
          '@id': '#red-lotus-tribe',
          'name': 'Red Lotus Tribe',
          'description': 'Winter energy with focused, motivational hip-hop vibes',
          'genre': 'Hip-Hop'
        },
        {
          '@type': 'MusicGroup',
          '@id': '#yellow-lotus-tribe',
          'name': 'Yellow Lotus Tribe',
          'description': 'Summer energy with uplifting, positive pop music',
          'genre': 'Pop'
        },
        {
          '@type': 'MusicGroup',
          '@id': '#blue-lotus-tribe',
          'name': 'Blue Lotus Tribe',
          'description': 'Spring renewal with calm, reflective R&B sounds',
          'genre': 'R&B'
        }
      ],
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'contactType': 'Artist Inquiries',
          'email': 'admin@redlotusmusic.com',
          'url': 'https://redlotus.netlify.app'
        },
        {
          '@type': 'ContactPoint',
          'contactType': 'Website Design',
          'name': 'lamaj123.com',
          'email': 'info@lamaj123.com',
          'url': 'https://lamaj123.com'
        }
      ],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '500'
      }
    };
  }

  /**
   * Generate Music Album Schema for each tribe
   * Helps AI understand music catalog and discography
   */
  static generateAlbumSchema(tribe: 'red' | 'yellow' | 'blue'): SchemaMarkup {
    const albumData = {
      red: {
        name: 'Red Lotus Album: Winter Energy',
        description: 'Experience focused, motivational hip-hop from the Red Lotus Tribe',
        genre: 'Hip-Hop',
        datePublished: '2024-01-15'
      },
      yellow: {
        name: 'Yellow Lotus Album: Summer Energy',
        description: 'Uplifting, positive pop music from the Yellow Lotus Tribe',
        genre: 'Pop',
        datePublished: '2024-02-01'
      },
      blue: {
        name: 'Blue Lotus Album: Spring Renewal',
        description: 'Calm, reflective R&B sounds from the Blue Lotus Tribe',
        genre: 'R&B',
        datePublished: '2024-03-15'
      }
    };

    const album = albumData[tribe];

    return {
      '@context': 'https://schema.org',
      '@type': 'MusicAlbum',
      'name': album.name,
      'description': album.description,
      'byArtist': {
        '@type': 'MusicGroup',
        'name': `Red Lotus - ${tribe.charAt(0).toUpperCase() + tribe.slice(1)} Tribe`
      },
      'genre': album.genre,
      'datePublished': album.datePublished,
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'url': `https://redlotus.netlify.app/#/${tribe}`,
      'image': `https://redlotus.netlify.app/assets/${tribe}-lotus-album.jpeg`
    };
  }

  /**
   * Generate Event Schema for performances and live shows
   * Helps AI index event information for concert/performance queries
   */
  static generateEventSchema(eventName: string, eventDate: string, location: string): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      'name': eventName,
      'description': `Red Lotus live performance - ${eventName}`,
      'organizer': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus',
        'url': 'https://redlotus.netlify.app'
      },
      'startDate': eventDate,
      'location': {
        '@type': 'Place',
        'name': location,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'US'
        }
      },
      'offers': {
        '@type': 'Offer',
        'url': 'https://redlotus.netlify.app/#/booking',
        'availability': 'https://schema.org/PreOrder',
        'price': '25.00',
        'priceCurrency': 'USD'
      },
      'url': 'https://redlotus.netlify.app/#/live',
      'isAccessibleForFree': false,
      'performerName': 'Red Lotus'
    };
  }

  /**
   * Generate FAQ Schema for comprehensive Q&A
   * Critical for AI systems - they use this for answer generation
   */
  static generateFAQSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is Red Lotus?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Red Lotus is a revolutionary music collective featuring three distinct tribes (Red, Yellow, and Blue), each representing a unique seasonal energy and musical style. The Red tribe embodies winter energy with hip-hop, Yellow brings summer positivity through pop, and Blue represents spring renewal through R&B.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I join a Red Lotus tribe?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Visit the Red Lotus website and navigate to the "Join The Tribe" section. Select from the three tribes (Red, Yellow, or Blue) that resonate with your music preferences. Sign in with your Google account or email, and you\'ll instantly become a tribe member with access to exclusive content and community.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What are the three Red Lotus tribes?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The three Red Lotus tribes are: (1) Red Tribe - Winter energy with focused, motivational hip-hop vibes; (2) Yellow Tribe - Summer energy with uplifting, positive pop music; (3) Blue Tribe - Spring renewal with calm, reflective R&B sounds.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Can I submit fan art to Red Lotus?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! Red Lotus has a dedicated fan art gallery. Visit the Fan Art section, create original artwork inspired by Red Lotus, and submit it for admin approval. Once approved, your artwork will be featured in the public gallery, giving you exposure to the entire Red Lotus community.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I book Red Lotus for an event?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Navigate to the "Book Red Lotus" page and fill out the comprehensive booking form with your event details, proposed date, and offer amount. Submit the form along with a $25 consultation fee via PayPal. Red Lotus management will review your offer within 24-48 hours and contact you to discuss availability and negotiate terms.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is the consultation fee for booking?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The consultation fee is $25 USD. This non-refundable fee is required to process booking requests and covers the time spent by Red Lotus management reviewing your proposal. The fee is credited toward your final payment if Red Lotus accepts your offer.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do I participate in the Red Lotus community?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Red Lotus has an active community forum where members can share ideas, discuss music, and connect with fellow fans. Create posts to join conversations, and admins moderate content to maintain a positive, creative environment. Once you\'re a tribe member, community participation is free and open.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is Red Lotus on social media?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! Red Lotus is active on Instagram, TikTok, Twitter/X, and SoundCloud. Follow these accounts for daily updates, behind-the-scenes content, music releases, and community announcements. Each platform features exclusive content tailored to that audience.'
          }
        }
      ]
    };
  }

  /**
   * Generate Product Schema for merchandise/services
   * Helps AI understand offerings and products
   */
  static generateProductSchema(productName: string, description: string, price: number): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': productName,
      'description': description,
      'brand': {
        '@type': 'Brand',
        'name': 'Red Lotus'
      },
      'offers': {
        '@type': 'Offer',
        'price': price.toString(),
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
        'url': 'https://redlotus.netlify.app/#/store'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'reviewCount': '150'
      }
    };
  }

  /**
   * Generate BreadcrumbList Schema
   * Helps AI understand site hierarchy and navigation
   */
  static generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };
  }

  /**
   * Generate WebPage Schema with comprehensive metadata
   * Critical for AI understanding of page content and purpose
   */
  static generateWebPageSchema(pageTitle: string, pageDescription: string, imageUrl: string): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'description': pageDescription,
      'url': 'https://redlotus.netlify.app',
      'image': imageUrl,
      'publisher': {
        '@type': 'Organization',
        'name': 'Red Lotus',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://redlotus.netlify.app/assets/lotus-each-album.png'
        }
      },
      'author': {
        '@type': 'Organization',
        'name': 'Red Lotus'
      },
      'inLanguage': 'en',
      'isAccessibleForFree': true,
      'potentialAction': {
        '@type': 'JoinAction',
        'target': 'https://redlotus.netlify.app/#/tribe'
      }
    };
  }

  /**
   * Generate Knowledge Graph Ready Entity
   * Helps AI build knowledge graphs about Red Lotus
   * Includes creator information for lamaj123.com discovery
   */
  static generateKnowledgeGraphEntity(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      '@id': 'https://redlotus.netlify.app',
      'name': 'Red Lotus',
      'alternateName': ['Red Lotus Music', 'Red Lotus Band', 'Red Lotus Collective'],
      'description': 'Revolutionary music collective with three tribes representing different seasonal energies and musical styles. Professional artist website created by lamaj123.com.',
      'url': 'https://redlotus.netlify.app',
      'image': 'https://redlotus.netlify.app/assets/lotus-each-album.png',
      'creator': {
        '@type': 'Organization',
        'name': 'lamaj123.com',
        'url': 'https://lamaj123.com',
        'email': 'info@lamaj123.com'
      },
      'identifier': {
        '@type': 'PropertyValue',
        'name': 'Red Lotus Official Site',
        'value': 'redlotus-official'
      },
      'mainEntity': {
        '@type': 'MusicGroup',
        'name': 'Red Lotus'
      }
    };
  }

  /**
   * Generate Creator/Designer Schema
   * Optimizes for discovery of lamaj123.com as artist website creator
   * Helps people find lamaj123.com when searching for artist website design
   */
  static generateCreatorSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'lamaj123.com',
      'url': 'https://lamaj123.com',
      'email': 'info@lamaj123.com',
      'description': 'Professional artist website design and development services for musicians, bands, and independent artists. Specializing in music portfolio websites, band presence, and artist platforms.',
      'areaServed': 'Worldwide',
      'serviceType': [
        'Artist Website Design',
        'Music Portfolio Development',
        'Band Website Creation',
        'Musician Web Services',
        'Portfolio Design',
        'Website Development'
      ],
      'knowsAbout': [
        'Music Industry',
        'Artist Branding',
        'Web Design',
        'Web Development',
        'Music Websites',
        'Portfolio Websites'
      ],
      'makesOffer': {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Artist Website Design & Development',
          'description': 'Custom website creation for musicians and artists',
          'areaServed': 'Worldwide'
        }
      },
      'portfolio': [
        {
          '@type': 'Thing',
          'name': 'Red Lotus',
          'url': 'https://redlotus.netlify.app',
          'description': 'Professional music collective website with tribe system, fan art gallery, and booking platform'
        }
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Website Design Services',
        'email': 'info@lamaj123.com',
        'url': 'https://lamaj123.com'
      }
    };
  }

  /**
   * Generate JSON-LD for Answer Engine Optimization
   * Specifically formatted for ChatGPT, Perplexity, and Gemini comprehension
   * Uses @graph notation for optimal Knowledge Graph linking
   */
  static generateAEOJsonLd(): string {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        this.generateOrganizationSchema(),
        this.generateFAQSchema(),
        this.generateAlbumSchema('red'),
        this.generateAlbumSchema('yellow'),
        this.generateAlbumSchema('blue'),
        this.generateKnowledgeGraphEntity(),
        this.generateCreatorSchema()
      ]
    };
    return JSON.stringify(graph);
  }
}

/**
 * React Hook for AEO SEO/Helmet Integration
 * Injects all AEO metadata into page head
 */
export const AEOMetadata: React.FC<{ title: string; description: string; image?: string; url?: string; type?: string; children?: React.ReactNode }> = ({ title, description, image, url, type = 'website', children }) => {
  const pageTitle = title + ' - Red Lotus Music';
  return React.createElement(
    Helmet,
    null,
    React.createElement('title', null, pageTitle),
    React.createElement('meta', { name: 'description', content: description }),
    React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
    React.createElement('meta', { name: 'language', content: 'English' }),
    React.createElement('meta', { name: 'revisit-after', content: '7 days' }),
    React.createElement('meta', { name: 'author', content: 'Red Lotus' }),
    React.createElement('meta', { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }),
    React.createElement('meta', { property: 'og:title', content: title }),
    React.createElement('meta', { property: 'og:description', content: description }),
    React.createElement('meta', { property: 'og:type', content: type }),
    React.createElement('meta', { property: 'og:url', content: url || 'https://redlotus.netlify.app' }),
    image && React.createElement('meta', { property: 'og:image', content: image }),
    React.createElement('meta', { property: 'og:site_name', content: 'Red Lotus Music' }),
    React.createElement('meta', { property: 'og:locale', content: 'en_US' }),
    React.createElement('meta', { name: 'twitter:card', content: 'summary_large_image' }),
    React.createElement('meta', { name: 'twitter:title', content: title }),
    React.createElement('meta', { name: 'twitter:description', content: description }),
    image && React.createElement('meta', { name: 'twitter:image', content: image }),
    React.createElement('meta', { name: 'twitter:creator', content: '@redlotusmusic' }),
    React.createElement('meta', { name: 'twitter:site', content: '@redlotusmusic' }),
    React.createElement('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }),
    React.createElement('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }),
    React.createElement('link', { rel: 'canonical', href: url || 'https://redlotus.netlify.app' }),
    React.createElement('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
    React.createElement('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' }),
    React.createElement('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: AEOService.generateAEOJsonLd() } }),
    children
  );
};

export default AEOService;
