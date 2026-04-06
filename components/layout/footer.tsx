export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-slate-950">Hawari Commerce</p>
          <p className="mt-2 max-w-xl">
            Storefront cepat berbasis App Router, checkout modern, dan dashboard admin untuk skala marketplace.
          </p>
        </div>
        <div className="flex gap-6">
          <a href="mailto:support@hawari.test">support@hawari.test</a>
          <span>Jakarta, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
