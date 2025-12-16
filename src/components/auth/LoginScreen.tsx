'use client';

import { useState } from 'react';
import { RiFileTextLine, RiEyeLine, RiEyeOffLine, RiLoginBoxLine } from 'react-icons/ri';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'access_pin')
        .single();

      if (error) throw error;

      if (data && data.value === pin) {
        onLogin();
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
        const input = document.getElementById('pinInput');
        if (input) input.focus();
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for demo if DB not connected/setup yet
      if (pin === '1111') {
        onLogin();
      } else {
        setError('Connection error or Invalid PIN.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
            <RiFileTextLine className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DCS Tender Portal</h1>
          <p className="text-gray-500">Secure Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pinInput" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter 4-Digit PIN
            </label>
            <div className="relative">
              <input
                id="pinInput"
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                placeholder="••••"
                autoComplete="off"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPin ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            <RiLoginBoxLine size={20} />
            <span>Login</span>
          </Button>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium animate-in shake">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
