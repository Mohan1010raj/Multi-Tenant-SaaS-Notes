import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

export default function Notes(){
  const [notes,setNotes]=useState([])
  const [title,setTitle]=useState('')
  const [content,setContent]=useState('')
  const [user,setUser]=useState(null)
  const [error,setError]=useState('')
  const [plan,setPlan]=useState('free')

  useEffect(()=> {
    const u = localStorage.getItem('user')
    if (!u) { window.location = '/login'; return }
    setUser(JSON.parse(u))
    fetchNotes()
    // fetch tenant plan by calling /api/notes (notes includes tenant id) and retrieving tenant; simplified:
    fetch('/api/health') // no-op; plan is fetched later on create (server enforces)
  },[])

  async function fetchNotes(){
    const token = localStorage.getItem('token')
    const res = await fetch('/api/notes', { headers: { Authorization: 'Bearer '+token } })
    const data = await res.json()
    if (!res.ok) { setError(data?.error||'failed'); return }
    setNotes(data)
  }

  async function createNote(e){
    e.preventDefault()
    setError('')
    const token = localStorage.getItem('token')
    const res = await fetch('/api/notes', { method:'POST', headers:{ 'content-type':'application/json', Authorization: 'Bearer '+token }, body: JSON.stringify({ title, content }) })
    const data = await res.json()
    if (!res.ok) {
      setError(data?.error||'failed')
      return
    }
    setTitle(''); setContent('')
    fetchNotes()
  }

  async function del(id){
    const token = localStorage.getItem('token')
    await fetch('/api/notes/'+id, { method:'DELETE', headers:{ Authorization: 'Bearer '+token } })
    fetchNotes()
  }

  return (
    <Layout>
      <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="logo"><img src="/logo.svg" width="36" alt="logo"/> SaaS Notes</div>
          <div>
            <button className="btn" onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location='/login' }}>Logout</button>
          </div>
        </div>

        <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:0.4}} style={{marginTop:20}}>
          <h2>Your notes</h2>
          {error && <div style={{color:'#ff7b7b'}}>{error}</div>}

          <form onSubmit={createNote} style={{marginTop:12}}>
            <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea className="input" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} style={{height:80}} />
            <button className="btn" type="submit">Create note</button>
          </form>

          <div style={{marginTop:20}}>
            {notes.length === 0 && <div className="card">No notes yet</div>}
            {notes.map(n=>(
              <motion.div key={n.id} layout className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>{n.title}</strong>
                  <div style={{opacity:0.8}}>{n.content}</div>
                </div>
                <div>
                  <button className="btn" onClick={()=>del(n.id)}>Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
