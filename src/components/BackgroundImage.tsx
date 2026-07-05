export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Light mode gradient */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: `linear-gradient(180deg, hsl(165 25% 97%) 0%, hsl(200 30% 94%) 50%, hsl(165 25% 97%) 100%)`,
        }}
      />
      {/* Dark mode gradient */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `linear-gradient(180deg, hsl(195 30% 8%) 0%, hsl(220 30% 6%) 50%, hsl(195 30% 8%) 100%)`,
        }}
      />
    </div>
  );
}
