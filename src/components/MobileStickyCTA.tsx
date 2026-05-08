export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-soft)] bg-[rgba(7,10,13,0.9)] px-4 py-3 backdrop-blur-xl md:hidden">
      <a
        href="#calculadora"
        className="flex min-h-11 items-center justify-center rounded-md border border-[var(--brand)] bg-[var(--brand)] px-4 text-sm font-bold text-[#06100b] shadow-lg shadow-black/30"
      >
        Simular margem
      </a>
    </div>
  );
}
