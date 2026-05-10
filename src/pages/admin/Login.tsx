import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { Building2, KeyRound, ArrowLeft, UserPlus } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('iamshanto7860@gmail.com');
  const [password, setPassword] = useState('78607860');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'iamshanto7860@gmail.com') {
          navigate({ pathname: '/superadmin', search: window.location.search });
        } else {
          navigate({ pathname: '/admin/dashboard', search: window.location.search });
        }
      }
    });
    return unsub;
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => navigate('/')}
        className="self-start md:absolute md:top-8 md:left-8 mb-8 md:mb-0 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back Home
      </button>

      <div className="max-w-md w-full bg-bg-card border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black uppercase tracking-widest text-center mb-2">Admin Access</h2>
        <p className="text-white/50 text-xs text-center uppercase tracking-widest mb-8">
          {isSignUp ? "Register a new restaurant admin account" : "Sign in to manage your restaurant"}
        </p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-accent/90 transition-colors flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : isSignUp ? (
              <><UserPlus className="w-5 h-5" /> Register</>
            ) : (
              <><KeyRound className="w-5 h-5" /> Sign In</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
