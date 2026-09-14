type LogoPlaceholderProps = {
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
};

export default function LogoPlaceholder({
  size = 28,
  variant = 'dark',
  className = '',
}: LogoPlaceholderProps) {
  const bg = variant === 'light' ? 'bg-white/15 border-white/30' : 'bg-charcoal-100 border-charcoal-200';
  const text = variant === 'light' ? 'text-white' : 'text-charcoal-800';

  return (
    <div
      className={`flex items-center justify-center border ${bg} ${text} font-display font-bold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label="Logo Constructora El Gallego"
    >
      EG
    </div>
  );
}
