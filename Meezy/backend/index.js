const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()

app.use(cors())
app.use(bodyParser.json())

const SECRET = 'supersecret'

// --- In-memory database ---
let users = []  // {id, name, email, password, role}
let products = [
  { id: 1, title:'Product 1', price:100, seller:'Alice', description:'Specs of Product 1' },
  { id: 2, title:'Product 2', price:200, seller:'Bob', description:'Specs of Product 2' },
]
let orders = []

// --- Helpers ---
function authMiddleware(req,res,next){
  const header = req.headers['authorization']
  if(!header) return res.status(401).json({error:'Missing token'})
  const token = header.split(' ')[1]
  try{
    const user = jwt.verify(token, SECRET)
    req.user = user
    next()
  }catch(e){
    res.status(401).json({error:'Invalid token'})
  }
}

// --- Routes ---

// Register
app.post('/api/register', (req,res)=>{
  const { name, email, password, role } = req.body
  if(!name || !email || !password) return res.status(400).json({ error:'Name, email, password required' })
  if(users.find(u=>u.email===email)) return res.status(400).json({ error:'Email already exists' })

  const user = { id: users.length+1, name, email, password, role }
  users.push(user)
  const token = jwt.sign({ id:user.id, email:user.email, name:user.name, role:user.role }, SECRET)
  res.json({ token, user })
})

// Login
app.post('/api/login', (req,res)=>{
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error:'Email and password required' })
  const user = users.find(u=>u.email===email && u.password===password)
  if(!user) return res.status(400).json({ error:'Invalid credentials' })
  const token = jwt.sign({ id:user.id, email:user.email, name:user.name, role:user.role }, SECRET)
  res.json({ token, user })
})

// Get current user
app.get('/api/me', authMiddleware, (req,res)=>{
  const user = users.find(u=>u.id===req.user.id)
  res.json(user)
})

// Products
app.get('/api/products', (req,res)=>{
  res.json(products)
})

// Product by ID
app.get('/api/products/:id', (req,res)=>{
  const p = products.find(x=>x.id==req.params.id)
  if(!p) return res.status(404).json({error:'Not found'})
  res.json(p)
})

// Orders
app.post('/api/orders', authMiddleware, (req,res)=>{
  const { items, address, payment } = req.body
  if(!items || items.length===0) return res.status(400).json({error:'Cart empty'})
  const order = { id: orders.length+1, userId:req.user.id, items, address, payment }
  orders.push(order)
  res.json({ order })
})

// Start server
const PORT = 4000
app.listen(PORT, ()=>console.log(`Backend running on ${PORT}`))
