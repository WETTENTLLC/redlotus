import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  musicAlbum?: {
    name: string;
    artist: string;
    releaseDate?: string;
    tracks?: number;
  };
  event?: {
    name: string;
    startDate: string;
    endDate?: string;
    location?: string;
    price?: number;
  };
}

const SEOService: React.FC<SEOProps> = ({  title = "Red Lotus Music | Official Hip-Hop, R&B & Pop Artist",
  description = "Red Lotus - The official music destination for groundbreaking hip-hop, R&B, and pop music. Stream albums, join the tribe, experience live shows, and connect with the #1 music collective worldwide.",
  keywords = "Red Lotus music, hip hop artist, R&B music, pop music, rap albums, music streaming, live concerts, music videos, independent artist, music collective, rap lyrics, urban music",
  image = "/og-image-red-lotus.png",
  url = "https://redlotusofficial.com",
  type = "website",
  canonicalUrl,
  noIndex = false,
  musicAlbum,
  event
}) => {
  const siteTitle = "Red Lotus Music";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Red Lotus",
    "alternateName": "Red Lotus Music",
    "description": "Innovative music collective creating hip-hop, R&B, and pop music through seasonal themes and emotional storytelling",
    "url": "https://redlotusofficial.com",
    "image": "https://redlotusofficial.com/og-image-red-lotus.png",
    "logo": "https://redlotusofficial.com/favicon.ico",
    "sameAs": [
      "https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/",
      "https://www.instagram.com/red.lotus.music/",
      "https://www.tiktok.com/@red_lotus_music",
      "https://www.youtube.com/@Red-Lotus-Music"
    ],
    "genre": ["Hip Hop", "R&B", "Pop", "Rap", "Urban"],
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Red Lotus Music Catalog",
      "itemListElement": [
        {
          "@type": "MusicAlbum",
          "name": "Lotus: The Red Album",
          "description": "Hard-hitting rap tracks for the winter season",
          "genre": "Hip Hop",
          "datePublished": "2024"
        },
        {
          "@type": "MusicAlbum", 
          "name": "Lotus: The Yellow Album",
          "description": "Uplifting pop music for spring vibes",
          "genre": "Pop",
          "datePublished": "2024"
        },
        {
          "@type": "MusicAlbum",
          "name": "Lotus: The Blue Album", 
          "description": "Smooth R&B sounds for summer nights",
          "genre": "R&B",
          "datePublished": "2024"
        }
      ]
    }
  };

  // Album-specific structured data
  if (musicAlbum) {
    const albumData = {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      "name": musicAlbum.name,
      "byArtist": {
        "@type": "MusicGroup",
        "name": musicAlbum.artist
      },
      "datePublished": musicAlbum.releaseDate,
      "numTracks": musicAlbum.tracks,
      "genre": ["Hip Hop", "R&B", "Pop"],
      "recordLabel": "Red Lotus Music"
    };
    
    return (
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {noIndex && <meta name="robots" content="noindex,nofollow" />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="music.album" />
        <meta property="og:site_name" content="Red Lotus Music" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@redlotusmusic" />
        
        {/* Music-specific meta tags */}
        <meta property="music:album" content={musicAlbum.name} />
        <meta property="music:musician" content={musicAlbum.artist} />
        <meta property="music:release_date" content={musicAlbum.releaseDate} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([structuredData, albumData])}
        </script>
      </Helmet>
    );
  }

  // Event-specific structured data  
  if (event) {
    const eventData = {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      "name": event.name,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": event.location ? {
        "@type": "Place",
        "name": event.location
      } : {
        "@type": "VirtualLocation",
        "url": "https://redlotusmusic.com/live"
      },
      "performer": {
        "@type": "MusicGroup",
        "name": "Red Lotus"
      },
      "offers": event.price ? {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      } : undefined,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"
    };
    
    return (
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {noIndex && <meta name="robots" content="noindex,nofollow" />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Red Lotus Music" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@redlotusmusic" />
        
        {/* Event-specific meta tags */}
        <meta property="event:start_time" content={event.startDate} />
        {event.endDate && <meta property="event:end_time" content={event.endDate} />}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([structuredData, eventData])}
        </script>
      </Helmet>
    );
  }

  // Default structured data for main site
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Red Lotus Music" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@redlotusmusic" />
      <meta name="twitter:creator" content="@redlotusmusic" />
      
      {/* Music industry specific meta tags */}
      <meta name="music:genre" content="Hip Hop, R&B, Pop" />
      <meta name="music:artist" content="Red Lotus" />
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="Red Lotus Music" />
      <meta name="publisher" content="Red Lotus Music" />
      <meta name="copyright" content="© 2024 Red Lotus Music. All rights reserved." />
      <meta name="language" content="en-US" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOService;
