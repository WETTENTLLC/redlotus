import React from 'react';

type AccentColor = 'red' | 'yellow' | 'blue' | 'green' | 'brown' | 'pink';

interface ProductCardProps {
  title: string;
  description?: string;
  image?: string;
  accentColor?: AccentColor;
  onClick?: () => void;
  children?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
  accentColor = 'red',
  onClick,
  children,
}) => {
  return (
    <div className="product-card" onClick={onClick}>
      {image && <img src={image} alt={title} className="product-image" />}
      <div className="product-info">
        {accentColor && <div className={`product-accent ${accentColor}`}></div>}
        <h3 className="product-name">{title}</h3>
        {description && <p className="product-description">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default ProductCard;
