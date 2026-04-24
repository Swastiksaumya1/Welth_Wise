import React from 'react';

function DashboardCard({ title, amount, type, icon, trend }) {
  const isNegative = amount < 0;
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Math.abs(amount));

  return (
    <div className={`card animate-in`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>
            {isNegative ? '-' : ''}{formattedAmount}
          </h2>
        </div>
        <div className="glass" style={{ 
          padding: '0.75rem', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: `hsl(var(--${type === 'income' ? 'success' : type === 'expense' ? 'destructive' : 'primary'}) / 0.1)`
        }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        </div>
      </div>
      
      {trend && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ 
            color: trend > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
            fontWeight: '600'
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>vs last month</span>
        </div>
      )}
      
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        width: '100%', 
        height: '4px', 
        backgroundColor: `hsl(var(--${type === 'income' ? 'success' : type === 'expense' ? 'destructive' : 'primary'}) / 0.5)` 
      }} />
    </div>
  );
}

export default DashboardCard;