import Link from 'next/link'
import Layout from '../components/Layout'
export default function Home(){
  return (
    <Layout>
      <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="logo"><img src="/logo.svg" width="36" alt="logo"/> SaaS Notes</div>
          <div>
            <Link href="/login"><button className="btn">Login</button></Link>
            <Link href="/register"><button className="btn" style={{marginLeft:8}}>Register</button></Link>
          </div>
        </div>

        <section style={{marginTop:20}}>
          <h1 style={{fontSize:28, marginBottom:6}}>Multi-tenant Notes, made simple</h1>
          <p style={{opacity:0.8}}>Supports tenants (Acme, Globex), JWT auth, role-based access, and subscription gating.</p>
        </section>

        <section style={{marginTop:20}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="card">
              <h3>Free plan</h3>
              <p>Limit: 3 notes per tenant.</p>
            </div>
            <div className="card">
              <h3>Pro plan</h3>
              <p>Unlimited notes, instant upgrade via API.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
