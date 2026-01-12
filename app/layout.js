import "./globals.css";

export const metadata = {
  title: "Cliché Studio | Retouching",
  description:
    "Cliché Studio is a high-end retouching post-production agency specializing in digital and e-commerce imagery, founded in 2025 in Bali by Xavier Cariou and Bastien Constant.",
  keywords: [
    "photographic post-production",
    "retouching",
    "color grading",
    "compositing",
    "e-commerce imagery",
    "fashion photography",
    "luxury photography",
    "advertising photography",
    "Bali",
    "digital retouching",
  ],
  authors: [{ name: "Cliché Studio" }],
  creator: "Cliché Studio",
  publisher: "Cliché Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.cliche-studio.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cliché Studio | Retouching",
    description:
      "Cliché Studio is a high-end retouching post-production agency specializing in digital and e-commerce imagery, founded in 2025 in Bali.",
    url: "https://www.cliche-studio.com",
    siteName: "Cliché Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Cliché Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cliché Studio | Retouching",
    description:
      "Cliché Studio is a high-end retouching post-production agency specializing in digital and e-commerce imagery.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D6EAF8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
