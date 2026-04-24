import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 70%, 45%)",
  "hsl(0, 63%, 31%)", 
  "hsl(35, 92%, 50%)", 
  "hsl(271, 76%, 53%)",
  "hsl(199, 89%, 48%)"
];

const CustomTooltip = ({ active, payload, currency = '₹' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ 
        padding: '0.75rem', 
        borderRadius: '8px', 
        border: '1px solid hsl(var(--border))',
        fontSize: '0.875rem'
      }}>
        <p style={{ fontWeight: '600' }}>{payload[0].name}</p>
        <p style={{ color: payload[0].fill }}>{currency}{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function TransactionChart({ data, currency = '₹' }) {
  if (!data || data.length === 0) {
    return (
      <div className="card glass animate-in" style={{ flex: '1 1 300px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No data to visualize yet</p>
      </div>
    );
  }

  return (
    <div className="card glass animate-in" style={{ flex: '1 1 300px', minWidth: '300px', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Expense Breakdown</h2>
      <div style={{ width: "100%", height: 300, flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height={300} minHeight={250}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={8}
              stroke="none"
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '0.875rem' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Showing data for all categories</p>
      </div>
    </div>
  );
}

export default TransactionChart;