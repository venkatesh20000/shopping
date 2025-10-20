import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './index.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const token = localStorage.getItem('token');

  async function fetchMe() {
    if (!token) return;
    const res = await fetch(API + '/me', { headers: { Authorization: 'Bearer ' + token } });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      logout();
    }
  }

  useEffect(() => { fetchMe(); }, []);

  function login(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return { user, login, logout, token };
}

function App() {
  const auth = useAuth();
  return (
    <BrowserRouter>
      <div className="max-w-5xl mx-auto p-4">
        <Header auth={auth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register auth={auth} />} />
          <Route path="/login" element={<Login auth={auth} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Header({ auth }) {
  return (
    <header className="flex justify-between items-center mb-6 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-purple-700"><Link to="/">Meezy</Link></h1>
      <nav className="flex gap-4">
        <Link className="font-semibold" to="/products">Products</Link>
        <Link className="font-semibold" to="/cart">Cart</Link>
        {auth.user ? (
          <>
            <span className="text-sm">Hi {auth.user.name}</span>
            <button className="px-3 py-1 bg-red-400 rounded text-white" onClick={auth.logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="px-3 py-1 bg-green-300 rounded" to="/login">Login</Link>
            <Link className="px-3 py-1 bg-blue-300 rounded" to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Home() {
  return <div className="text-center text-lg font-semibold">Welcome to Meezy Clone! Browse products to get started.</div>;
}

function Register({ auth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(API + '/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { auth.login(data.token, data.user); nav('/products'); }
    else { alert(data.error || 'Registration error'); }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 bg-white rounded shadow">
      <h3 className="font-semibold text-lg">Register</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="p-2 border rounded" />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="p-2 border rounded">
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button type="submit" className="py-2 px-3 bg-purple-500 text-white rounded">Register</button>
    </form>
  );
}

function Login({ auth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(API + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { auth.login(data.token, data.user); nav('/products'); }
    else { alert(data.error || 'Login error'); }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 bg-white rounded shadow">
      <h3 className="font-semibold text-lg">Login</h3>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="p-2 border rounded" />
      <button type="submit" className="py-2 px-3 bg-purple-500 text-white rounded">Login</button>
    </form>
  );
}

function Products() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(API + '/products').then(r => r.json()).then(setItems); }, []);
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Products</h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map(p => (
          <div key={p.id} className="p-3 border rounded bg-white">
            <h4 className="font-semibold">{p.title}</h4>
            <div>₹{p.price}</div>
            <div>Seller: {p.seller}</div>
            <div className="mt-2">
              <Link to={'/product/' + p.id}>
                <button className="px-3 py-1 bg-green-400 rounded text-white">View</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const nav = useNavigate();

  useEffect(() => { fetch(API + '/products/' + id).then(r => r.json()).then(setP); }, [id]);

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(x => x.id === p.id);
    if (found) found.qty++; else cart.push({ ...p, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  }

  function buyNow() {
    localStorage.setItem('cart', JSON.stringify([{ ...p, qty: 1 }]));
    nav('/checkout');
  }

  if (!p) return <div>Loading...</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold text-lg">{p.title}</h3>
      <div>Price: ₹{p.price}</div>
      <div>Specs: {p.specs || 'No details available'}</div>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 bg-purple-500 text-white rounded" onClick={buyNow}>Buy Now</button>
        <button className="px-3 py-1 bg-green-400 text-white rounded" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

function CartPage() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const nav = useNavigate();

  function remove(id) {
    const next = cart.filter(x => x.id !== id);
    localStorage.setItem('cart', JSON.stringify(next));
    setCart(next);
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Cart</h3>
      {cart.length === 0 && <div>No items</div>}
      <div className="space-y-2">
        {cart.map(i => (
          <div key={i.id} className="p-2 border rounded bg-white flex justify-between items-center">
            <div>{i.title} x {i.qty}</div>
            <div>₹{i.price * i.qty}</div>
            <button className="px-2 py-1 bg-red-400 text-white rounded" onClick={() => remove(i.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-3 font-semibold">Total: ₹{total}</div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 bg-green-300 rounded" onClick={() => nav('/products')}>Continue Shopping</button>
        <button className="px-3 py-1 bg-purple-500 text-white rounded" onClick={() => nav('/checkout')}>Checkout</button>
      </div>
    </div>
  );
}

function Checkout() {
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cod');
  const nav = useNavigate();

  async function submit() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) { alert('Cart is empty'); return; }
    const token = localStorage.getItem('token');
    const res = await fetch(API + '/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? 'Bearer ' + token : '' },
      body: JSON.stringify({ items: cart, address, payment })
    });
    const data = await res.json();
    if (res.ok) { localStorage.removeItem('cart'); alert('Order placed: ' + data.order.id); nav('/products'); }
    else { alert(data.error || 'Order error'); }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold text-lg mb-2">Checkout</h3>
      <textarea className="w-full p-2 border rounded" value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" />
      <div className="mt-2 space-x-4">
        <label><input type="radio" checked={payment === 'cod'} onChange={() => setPayment('cod')} /> Cash on delivery</label>
        <label><input type="radio" checked={payment === 'card'} onChange={() => setPayment('card')} /> Card (simulated)</label>
      </div>
      <button className="mt-3 px-3 py-1 bg-purple-500 text-white rounded" onClick={submit}>Place Order</button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
