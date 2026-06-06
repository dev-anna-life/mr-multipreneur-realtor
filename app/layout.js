import './globals.css'

export const metadata = {
  title: 'Harrison Ugochukwu | Real Estate',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans text-navy">{children}</body>
    </html>
  )
}
