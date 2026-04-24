import React, { useState, useEffect } from 'react';

function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        // Apply theme to the document
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--background', '224 71% 4%');
            document.documentElement.style.setProperty('--foreground', '213 31% 91%');
            document.documentElement.style.setProperty('--card', '224 71% 4%');
            document.documentElement.style.setProperty('--secondary', '222 47% 11%');
            document.documentElement.style.setProperty('--border', '216 34% 17%');
            document.documentElement.style.setProperty('--input', '216 34% 17%');
            document.documentElement.style.setProperty('--ring', '216 34% 17%');
            document.documentElement.style.setProperty('--muted', '223 47% 11%');
            document.documentElement.style.setProperty('--muted-foreground', '215 20% 65%');
            document.documentElement.style.setProperty('--accent', '216 34% 17%');
            document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
        } else {
            document.documentElement.style.setProperty('--background', '210 40% 98%');
            document.documentElement.style.setProperty('--foreground', '222.2 84% 4.9%');
            document.documentElement.style.setProperty('--card', '0 0% 100%');
            document.documentElement.style.setProperty('--secondary', '210 40% 96.1%');
            document.documentElement.style.setProperty('--border', '214.3 31.8% 91.4%');
            document.documentElement.style.setProperty('--input', '214.3 31.8% 91.4%');
            document.documentElement.style.setProperty('--ring', '222.2 84% 4.9%');
            document.documentElement.style.setProperty('--muted', '210 40% 96.1%');
            document.documentElement.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
            document.documentElement.style.setProperty('--accent', '210 40% 96.1%');
            document.documentElement.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button 
            onClick={toggleTheme}
            style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'hsl(var(--foreground))'
            }}
        >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
        </button>
    );
}

export default ThemeToggle;
