import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Login(){
  const [email,setEmail]=useState('admin@acme.test')
  const [password,setPassword]=useState('password')
  const [err,setErr]=useState('')
  const router = useRouter()

  async function submit(e){
    e.preventDefault()
    setErr('')
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})})
    const data = await res.json()
    if (!res.ok) return setErr(data?.error||'failed')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/notes')
  }

  return (
    <Layout>
      <div className="container" style={{maxWidth:600}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="logo"><img src="/logo.svg" width="36" alt="logo"/> SaaS Notes</div>
        </div>

        <form onSubmit={submit} style={{marginTop:20}}>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          <div style={{display:'flex', gap:8}}>
            <button className="btn" type="submit">Login</button>
          </div>
          {err && <p style={{color:'#ff7b7b'}}>{err}</p>}
          <div style={{marginTop:12, opacity:0.8}}>Predefined accounts: admin@acme.test, user@acme.test, admin@globex.test, user@globex.test (password: password)</div>
        </form>
      </div>
    </Layout>
  )
}
