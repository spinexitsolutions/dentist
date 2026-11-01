import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-6xl md:text-8xl">
        This page is <span className="serif-i text-accent">missing</span> a tooth.
      </h1>
      <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3 text-white">
        Back home
      </Link>
    </section>
  );
}
