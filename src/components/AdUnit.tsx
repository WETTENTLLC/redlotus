import React, { useEffect } from 'react';

interface AdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

/**
 * AdUnit Component - Renders Google AdSense ads
 * Properties must match your AdSense account setup
 */
const AdUnit: React.FC<AdUnitProps> = ({
  adSlot,
  adFormat = 'auto',
  fullWidth = true,
  style = {},
}) => {
  useEffect(() => {
    // Push the ad to refresh if adsbygoogle is available
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [adSlot]);

  return (
    <div
      style={{
        margin: '20px 0',
        minHeight: '250px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: fullWidth ? 'block' : 'inline-block',
          width: '100%',
          height: fullWidth ? 'auto' : '250px',
          ...style,
        }}
        data-ad-client="ca-pub-8949654440643542"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;
