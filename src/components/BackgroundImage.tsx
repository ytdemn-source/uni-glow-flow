import campusBg from '@/assets/campus-bg-2.jpg';

export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img
        src={campusBg}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center blur-[2px]"
      />
      {/* Light mode overlay */}
      <div 
        className="absolute inset-0 dark:hidden"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(165 25% 97% / 0.55) 0%,
            hsl(165 25% 97% / 0.65) 50%,
            hsl(165 25% 97% / 0.85) 100%
          )`,
        }}
      />
      {/* Dark mode overlay */}
      <div 
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(195 30% 8% / 0.6) 0%,
            hsl(195 30% 8% / 0.75) 50%,
            hsl(195 30% 8% / 0.9) 100%
          )`,
        }}
      />
    </div>
  );
}
