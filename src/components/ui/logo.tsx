import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'icon';
  className?: string;
  href?: string;
}

export function Logo({ 
  size = 'medium', 
  variant = 'default', 
  className = '',
  href = '/'
}: LogoProps) {
  // Responsive logo sizing
  const getLogoSize = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 30 };
      case 'large':
        return { width: 240, height: 60 };
      default: // medium
        return { width: 180, height: 45 };
    }
  };

  const dimensions = getLogoSize();
  const logoSrc = variant === 'icon' ? '/icon.svg' : '/logo.svg';

  const logoElement = (
    <Image
      src={logoSrc}
      alt="Carebanget"
      width={dimensions.width}
      height={dimensions.height}
      className={`logo ${className}`}
      priority={size === 'large'}
    />
  );

  // Jika ada href, wrap dengan Link
  if (href) {
    return (
      <Link href={href} className="logo-link">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

// Logo untuk header (responsive)
export function HeaderLogo() {
  return (
    <Logo 
      size="medium" 
      className="w-[140px] md:w-[160px] lg:w-[180px] h-auto transition-all duration-300 hover:scale-105"
      href="/"
    />
  );
}

// Logo icon kecil untuk sidebar/mobile menu
export function IconLogo() {
  return (
    <Logo 
      size="small" 
      variant="icon"
      className="w-8 h-8"
    />
  );
}
