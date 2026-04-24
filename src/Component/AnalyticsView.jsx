import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

function AnalyticsView({ transactions, currency = '₹' }) {
  // Group transactions by date for the area chart
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-GB');
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayTransactions = transactions.filter(tx => tx.date === date);
    return {
      name: date,
      income: dayTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
      expense: dayTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
    };
  });

  return (
    <div className="animate-in">
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>Financial Analytics</h2>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card glass" style={{ height: '400px' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Cash Flow Trend</h3>
          <ResponsiveContainer width="100%" height={320} minHeight={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${currency}${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ fontSize: '0.875rem' }}
                formatter={(val) => `${currency}${val.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="income" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card glass">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Savings Ratio</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'center' }}>
            {/* Simple progress ring placeholder or calculation */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'hsl(var(--primary))' }}>
                {transactions.length > 0 ? Math.round(((transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount,0) - transactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount,0)) / (transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount,0) || 1)) * 100) : 0}%
              </div>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Total Savings Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card glass" style={{ marginTop: '1.5rem', height: '300px' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Category Comparison</h3>
        <ResponsiveContainer width="100%" height={240} minHeight={200}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            />
            <Legend padding={20} />
            <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsView;
