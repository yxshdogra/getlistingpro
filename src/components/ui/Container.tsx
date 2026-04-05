export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1023px] px-4 lg:px-0 ${className}`}>
      {children}
    </div>
  );
}
