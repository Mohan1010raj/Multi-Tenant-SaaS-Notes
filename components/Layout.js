import Head from 'next/head'
export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>SaaS Notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ fontFamily: 'Inter, sans-serif', padding: 20 }}>
        {children}
      </main>
    </>
  )
}
