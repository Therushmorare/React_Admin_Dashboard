import "@/app/styles/globals.css"
import Layout from "@/app/components/Layout.jsx"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}

