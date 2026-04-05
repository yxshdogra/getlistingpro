export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-semibold uppercase tracking-[0.7px] leading-5 text-primary font-body">
      {children}
    </span>
  );
}
