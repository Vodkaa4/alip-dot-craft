import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialButtonProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  href,
  label,
  className,
  style,
}) => {
  const handleClick = () => {
    if (href.startsWith('mailto:')) {
      window.location.href = href;
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      style={style}
      className={cn(
        'w-14 h-14 rounded-full border-2 border-glass-border/50 bg-glass/50 backdrop-blur-sm',
        'hover:border-electric-blue hover:bg-electric-blue/10 hover:shadow-glow',
        'transition-all duration-300 ease-smooth group',
        'hover:scale-110 active:scale-95',
        className
      )}
      aria-label={label}
    >
      <span className="text-foreground group-hover:text-electric-blue transition-colors duration-300">
        {icon}
      </span>
    </Button>
  );
};

export default SocialButton;