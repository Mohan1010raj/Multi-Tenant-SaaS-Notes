import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Register(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const router = useRouter()
  async function submit(e){
    e.preventDefault()
    // In this demo, register calls invite endpoint if token present; otherwise simply warns.
    alert('Registration via invite only in this demo. Use provided test accounts or ask an Admin to invite.')
  }
  return (
    <Layout>
      <div className="container" style={{maxWidth:600}}>
        <h2>Register</h2>
        <form onSubmit={submit}>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          <button className="btn" type="submit">Register</button>
        </form>
      </div>
    </Layout>
  )
}
