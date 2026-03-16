import { Footer } from "@/components/site/footer";
import { FloatingNav } from "@/components/site/floating-nav";
import { FloatingWhatsAppButton } from "@/components/site/floating-whatsapp-button";
import { getSiteSettings } from "@/data/queries";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="site-shell pb-10">
      <FloatingNav
        hotelName={settings.hotelName}
        logo={settings.logo}
      />
      <main className="relative z-10 px-4 md:px-6">{children}</main>
      <div className="relative z-10 px-4 md:px-6">
        <Footer
          hotelName={settings.hotelName}
          whatsapp={settings.whatsapp}
          phone={settings.phone}
          email={settings.email}
          address={settings.address}
        />
      </div>
      <FloatingWhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
