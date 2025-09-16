"use client";
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, socialLogin } from '@/services/auth';
import { AuthContext } from '@/context/auth';
import './page.css';
import { auth, googleProvider } from '@/firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      // If no response or invalid response structure
      if (!response || typeof response !== 'object') {
        setError(
          <div>
            Hey there! 👋<br />
            We don't have an account with {email} yet. No worries though!<br />
            <Link href="/auth/signup" className="auth-link">
              Click here to create your account
            </Link>
          </div>
        );
        return;
      }

      // Handle error responses
      if (response.err) {
        if (response.err === "User does not exists") {
          setError(
            <div>
              Hey there! 👋<br />
              We don't have an account with {email} yet. No worries though!<br />
              <Link href="/auth/signup" className="auth-link">
                Click here to create your account
              </Link>
            </div>
          );
        } else if (response.err === "Password does not match") {
          setError(
            <div>
              Hmm, that password doesn't seem right for {email} 🤔<br />
              <Link href="/auth/forgot-password" className="auth-link">
                Forgot your password? Click here to reset it
              </Link>
            </div>
          );
        } else {
          setError(response.err);
        }
        return;
      }

      // Check for token
      if (!response.token) {
        setError(
          <div>
            Hey there! 👋<br />
            We don't have an account with {email} yet. No worries though!<br />
            <Link href="/auth/signup" className="auth-link">
              Click here to create your account
            </Link>
          </div>
        );
        return;
      }

      // Successful login
      localStorage.setItem("token", response.token);
      setIsLoggedIn(true);
      
      // Show welcome message
      setSuccessMessage(
        <div className="auth-success">
          Welcome back! 🎉<br />
          Redirecting you to your dashboard...
        </div>
      );

      // Wait for 1.5 seconds to show the welcome message before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError(
        <div>
          Hey there! 👋<br />
          We don't have an account with {email} yet. No worries though!<br />
          <Link href="/auth/signup" className="auth-link">
            Click here to create your account
          </Link>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user?.email;
      if (!email) return;
      const reg = await socialLogin({ email });
      if (reg?.token) {
        localStorage.setItem("token", reg.token);
        setIsLoggedIn(true);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {successMessage && <div className="auth-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="auth-link">
              Sign up
            </Link>
          </p>
          <div style={{ marginTop: '12px' }}>
            <button type="button" className="auth-button" onClick={handleGoogleSignIn}>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
