import React, { useState } from 'react';
import authService from '../../appwrite/auth';

function Login({ onLogin, onSwitchToSignup }) {
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const session = await authService.login(loginData);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    onLogin(userData);
                }
            }
        } catch (error) {
            setError(error.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'hsl(var(--background))' }}>
            <div className="card glass animate-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="glass card-gradient" style={{ width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <span style={{ fontSize: '2rem' }}>💎</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Welcome Back</h2>
                    <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>
                        Enter your credentials to access your dashboard.
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        background: 'hsl(var(--destructive) / 0.1)', 
                        color: 'hsl(var(--destructive))', 
                        padding: '0.75rem', 
                        borderRadius: 'var(--radius)', 
                        textAlign: 'center', 
                        marginBottom: '1.5rem', 
                        fontSize: '0.875rem', 
                        border: '1px solid hsl(var(--destructive) / 0.2)' 
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            required
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            required
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ justifyContent: 'center', padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                        Don't have an account? <button type="button" onClick={onSwitchToSignup} style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Create Account</button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
