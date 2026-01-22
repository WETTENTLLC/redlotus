/**
 * AEO Head Component
 * Comprehensive metadata injection for AI/Answer Engine Optimization
 * Used throughout the application for proper page-level metadata
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AEOService from '../services/AEOService';

interface AEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'music.album' | 'music.playlist' | 'music.song';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  schemaMarkups?: any[];
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * Comprehensive AEO Head Component
 * Injects all metadata, structured data, and semantic markup needed
 * for AI systems like ChatGPT, Perplexity, Gemini to properly index content
 */
export const AEOHead: React.FC<AEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://redlotus.netlify.app/assets/lotus-each-album.png',
  url = 'https://redlotus.netlify.app',
  type = 'website',
  author = 'Red Lotus',
  publishedDate,
  modifiedDate,
  schemaMarkups = [],
  breadcrumbs = []
}) => {
  // Add breadcrumbs if provided
  if (breadcrumbs.length > 0) {
    schemaMarkups.push(AEOService.generateBreadcrumbSchema(breadcrumbs));
  }

  return (
    <Helmet>
      {/* === CRITICAL META TAGS FOR AI SYSTEMS === */}

      {/* Primary Meta Tags */}
      <title>{title} | Red Lotus Music</title>
      <meta name="title" content={`${title} | Red Lotus Music`} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots & Indexing - Critical for AI crawlers */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1" />
      
      {/* AI-Specific Crawlers */}
      <meta name="ChatGPT-bot" content="index, follow" />
      <meta name="GPTBot" content="index, follow" />
      <meta name="CCBot" content="index, follow" />
      <meta name="Perplexity-bot" content="index, follow" />

      {/* Canonical URL - Prevents duplicate indexing by AI */}
      <link rel="canonical" href={url} />

      {/* Language & Region */}
      <meta httpEquiv="content-language" content="en-us" />
      <meta name="language" content="English" />

      {/* Viewport & Device */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Author & Copyright */}
      <meta name="author" content={author} />
      <meta name="copyright" content="© 2024 Red Lotus Music. All rights reserved." />

      {/* Timing Metadata */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      <meta name="revisit-after" content="7 days" />

      {/* === OPEN GRAPH PROTOCOL (Critical for Social & AI) === */}
      <meta property="og:site_name" content="Red Lotus Music" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:locale" content="en_US" />

      {/* Music-Specific OG Tags */}
      {type.includes('music') && (
        <>
          <meta property="music:creator" content="Red Lotus" />
          <meta property="music:musician" content="Red Lotus" />
        </>
      )}

      {/* === TWITTER CARD (AI Systems Monitor This) === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@redlotusmusic" />
      <meta name="twitter:creator" content="@redlotusmusic" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* === JSON-LD STRUCTURED DATA (CRITICAL FOR AI) === */}
      
      {/* Organization Schema - Identifies who Red Lotus is */}
      <script type="application/ld+json">
        {JSON.stringify(AEOService.generateOrganizationSchema())}
      </script>

      {/* Page Schema - Identifies what this page is about */}
      <script type="application/ld+json">
        {JSON.stringify(AEOService.generateWebPageSchema(title, description, image))}
      </script>

      {/* Breadcrumb Schema - Shows hierarchy to AI */}
      {breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(AEOService.generateBreadcrumbSchema([
            { name: 'Home', url: 'https://redlotus.netlify.app' },
            ...breadcrumbs
          ]))}
        </script>
      )}

      {/* FAQ Schema - Critical for AI answer generation */}
      <script type="application/ld+json">
        {JSON.stringify(AEOService.generateFAQSchema())}
      </script>

      {/* Knowledge Graph Entity - AI knowledge base building */}
      <script type="application/ld+json">
        {JSON.stringify(AEOService.generateKnowledgeGraphEntity())}
      </script>

      {/* Custom Schema Markups */}
      {schemaMarkups.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* === ADDITIONAL META TAGS FOR AI OPTIMIZATION === */}

      {/* Search Engine Verification */}
      <meta name="google-site-verification" content="red-lotus-music" />

      {/* Format Detection */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="email=no" />

      {/* Color Scheme */}
      <meta name="theme-color" content="#000000" />
      <meta name="color-scheme" content="light dark" />

      {/* Referrer Policy */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* X-UA-Compatible for IE (Legacy) */}
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Preconnect for Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* === ARTICLE-SPECIFIC METADATA === */}
      {type === 'article' && author && (
        <>
          <meta property="article:author" content={author} />
          {publishedDate && <meta property="article:published_time" content={publishedDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          <meta property="article:section" content="Music" />
          <meta property="article:tag" content="music" />
          <meta property="article:tag" content="red-lotus" />
        </>
      )}
    </Helmet>
  );
};

export default AEOHead;
