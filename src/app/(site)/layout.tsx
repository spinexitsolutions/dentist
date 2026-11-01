import { getDB } from "@/lib/db";
import Intro from "@/components/site/Intro";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SmoothScroll from "@/components/site/SmoothScroll";
import { Announcement, FloatingWhatsapp, MobileTopBar } from "@/components/site/Chrome";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const db = await getDB();
  const s = db.settings;
  const introScript = s.intro.enabled
    ? `try{${s.intro.showOncePerSession ? "" : "sessionStorage.removeItem('ivory-intro');"}if(sessionStorage.getItem('ivory-intro'))document.documentElement.dataset.introSeen='1'}catch(e){}`
    : `document.documentElement.dataset.introSeen='1'`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <style>{`[data-intro-seen="1"] [data-intro]{display:none!important}`}</style>
      {s.intro.enabled && <Intro intro={s.intro} accent={s.brand.accent} />}
      <SmoothScroll />
      <Navbar brand={s.brand} contact={s.contact} social={s.social} studioImage={s.hero.wideImage} />
      <div className="md:pl-[84px]">
        <Announcement a={s.announcement} />
        <MobileTopBar brand={s.brand} phone={s.contact.phone} />
        <main>{children}</main>
        <Footer brand={s.brand} contact={s.contact} social={s.social} services={db.services} />
      </div>
      <FloatingWhatsapp number={s.contact.whatsapp} />
    </>
  );
}
