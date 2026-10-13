import "./globals.css";

export const metadata = {
  title: "Pihu Malhotra — Sustainability & Biotechnology",
  description:
    "Portfolio of Pihu Malhotra: B.Tech Biotechnology student and Sustainability Intern at Jindal Steel Oman, focused on ESG, water footprinting and industrial sustainability.",
  openGraph: {
    title: "Pihu Malhotra — Sustainability & Biotechnology",
    description: "ESG, water footprinting and industrial sustainability. B.Tech Biotechnology, Manipal University Jaipur.",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1512" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
