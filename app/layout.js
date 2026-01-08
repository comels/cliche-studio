import './globals.css'

export const metadata = {
  title: 'Cliche',
  description: 'Cliche website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

