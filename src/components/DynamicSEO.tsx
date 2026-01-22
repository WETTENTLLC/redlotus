import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'music.album' | 'music.song' | 'profile' | 'article';
  publishedTime?: string;
  section?: string;
  albumData?: {
    name: string;
    artist: string;
    genre: string[];
    releaseDate: string;
    tracks?: number;
  };
  eventData?: {
    name: string;
    startDate: string;
    endDate?: string;
    location?: string;
    price?: number;
  };
}

const DynamicSEO: React.FC<DynamicSEOProps> = ({
  title = 'Red Lotus Music - Official Site | Independent Music Collective',
  description = 'Red Lotus Music - Experience the official music collective. Discover exclusive albums, join the tribe, attend live shows, and connect with an innovative independent artist community.',
  keywords = ['Red Lotus Music', 'independent music', 'music collective', 'hip hop', 'R&B', 'pop music'],
  image = '/og-image.png',
  url = '/',
  type = 'website',
  publishedTime,
  section,  albumData,
  eventData
}) => {
  const baseUrl = 'https://redlotusofficial.com';
  const fullUrl = `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullTitle = title.includes('Red Lotus') ? title : `${title} | Red Lotus Music`;
  const keywordsString = keywords.join(', ');

  // Generate structured data based on content type
  const getStructuredData = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Red Lotus Music',
      'url': baseUrl,
      'logo': `${baseUrl}/logo.png`,
      'description': 'Independent music collective featuring innovative artists across hip-hop, R&B, and pop genres.',
      'sameAs': [
        'https://www.instagram.com/red.lotus.music/',
        'https://www.tiktok.com/@red_lotus_music',
        'https://www.youtube.com/@Red-Lotus-Music'
      ]
    };

    if (albumData) {
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicAlbum',
        'name': albumData.name,
        'byArtist': {
          '@type': 'MusicGroup',
          'name': albumData.artist || 'Red Lotus Music'
        },
        'genre': albumData.genre,
        'datePublished': albumData.releaseDate,
        'numTracks': albumData.tracks,
        'recordLabel': 'Red Lotus Music',
        'url': fullUrl,
        'image': fullImageUrl
      };
    }

    if (eventData) {
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        'name': eventData.name,
        'startDate': eventData.startDate,
        'endDate': eventData.endDate,
        'location': eventData.location ? {
          '@type': 'Place',
          'name': eventData.location
        } : {
          '@type': 'VirtualLocation',
          'url': fullUrl
        },
        'performer': {
          '@type': 'MusicGroup',
          'name': 'Red Lotus Music',
          'url': baseUrl
        },
        'organizer': {
          '@type': 'Organization',
          'name': 'Red Lotus Music',
          'url': baseUrl
        },
        'image': fullImageUrl,
        'url': fullUrl,
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode'
      };
    }

    return baseSchema;
  };

  const structuredData = getStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="Red Lotus Music" />
      <meta name="publisher" content="Red Lotus Music" />
      <meta name="copyright" content="© 2024 Red Lotus Music. All rights reserved." />
      <meta name="language" content="en-US" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Red Lotus Music" />
      <meta property="og:locale" content="en_US" />
      
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      
      {section && (
        <meta property="article:section" content={section} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@redlotusmusic" />
      <meta name="twitter:creator" content="@redlotusmusic" />

      {/* Music-specific Meta Tags */}
      <meta name="music:genre" content="Hip Hop, R&B, Pop" />
      <meta name="music:artist" content="Red Lotus Music" />
      
      {albumData && (
        <>
          <meta property="music:album" content={albumData.name} />
          <meta property="music:musician" content={albumData.artist} />
          <meta property="music:release_date" content={albumData.releaseDate} />
        </>
      )}

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Performance and SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default DynamicSEO;
