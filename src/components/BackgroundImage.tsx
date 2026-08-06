export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-pattern opacity-40" />
    </div>
  );
}
