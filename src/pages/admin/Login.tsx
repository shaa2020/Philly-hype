import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { Building2, KeyRound, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate({ pathname: '/admin/dashboard', search: window.location.search });
      }
    });
    return unsub;
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => navigate('/')}
        className="self-start md:absolute md:top-8 md:left-8 mb-8 md:mb-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back Home
      </button>

      <div className="max-w-md w-full bg-[#ffffff] border border-zinc-200 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 shadow-inner">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black uppercase tracking-widest text-center mb-2 text-zinc-900">Admin Access</h2>
        <p className="text-zinc-500 text-xs text-center uppercase tracking-widest mb-8">
          Sign in to manage your restaurant
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-accent/90 transition-transform transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(255,107,0,0.3)] flex justify-center items-center gap-2"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
               <><KeyRound className="w-5 h-5" /> Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
