import React, { useState } from 'react';
import authService from '../../appwrite/auth';

function Signup({ onLogin, onSwitchToLogin }) {
    const [error, setError] = useState("");
    const [signupData, setSignupData] = useState({
        email: "",
        password: "",
        name: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (signupData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        if (signupData.name.trim().length < 2) {
            setError("Please enter a valid full name.");
            return;
        }

        setLoading(true);
        try {
            const userData = await authService.createAccount(signupData);
            if (userData) {
                const loggedInUser = await authService.getCurrentUser();
                if (loggedInUser) {
                    onLogin(loggedInUser);
                }
            }
        } catch (error) {
            setError(error.message || "An error occurred during registration. Please try again.");
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
                    <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Create Account</h2>
                    <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>
                        Join WealthWise today and take control of your finances.
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
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe"
                            required
                            value={signupData.name}
                            onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com"
                            required
                            value={signupData.email}
                            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            required
                            value={signupData.password}
                            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ justifyContent: 'center', padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                        Already have an account? <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Sign In</button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
