import React, { useState } from 'react';

function BudgetsView({ transactions, currency = '₹', userPrefs, updateUserPrefs }) {
  const budgets = userPrefs?.budgets || [];
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState({ name: '', limit: '' });

  const income = transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  const consumption = income > 0 ? (expense / income) * 100 : 0;

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.limit) return;
    const added = { id: Date.now(), name: newBudget.name, limit: Number(newBudget.limit) };
    updateUserPrefs({ budgets: [...budgets, added] });
    setNewBudget({ name: '', limit: '' });
  };

  const handleDeleteBudget = (id) => {
    updateUserPrefs({ budgets: budgets.filter(b => b.id !== id) });
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '3rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Budget Allocations</h2>
          <button 
            className="btn-primary" 
            onClick={() => setIsEditing(!isEditing)}
            style={{ padding: '0.6rem 1.25rem', borderRadius: '50px' }}
          >
            {isEditing ? 'View Mode' : 'Manage Categories'}
          </button>
        </div>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Set limits and monitor your spending habits dynamically.</p>
      </header>

      <section className="card glass" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          Monthly Health
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '600' }}>
              <span>Total Income Consumed</span>
              <span>{Math.round(consumption)}%</span>
            </div>
            <div style={{ width: '100%', height: '16px', backgroundColor: 'hsl(var(--secondary))', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(consumption, 100)}%`, 
                height: '100%', 
                backgroundColor: consumption > 85 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                transition: 'width 1s ease-out'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Total Income</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700' }}>{currency}{income.toLocaleString()}</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: '12px', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Total Expense</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'hsl(var(--destructive))' }}>{currency}{expense.toLocaleString()}</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: '12px', background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.2)' }}>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--primary))', marginBottom: '0.5rem', fontWeight: '600' }}>Net Remaining</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>{currency}{(income - expense).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {isEditing && (
        <section className="animate-in" style={{ marginBottom: '2rem' }}>
          <form 
            onSubmit={handleAddBudget} 
            className="card glass"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              border: '1px dashed hsl(var(--primary))',
              background: 'hsl(var(--primary) / 0.02)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Add Custom Category</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Category Name</label>
                <input 
                  style={{ width: '100%', boxSizing: 'border-box' }} 
                  placeholder="e.g. Subscriptions" 
                  required 
                  value={newBudget.name} 
                  onChange={e => setNewBudget({...newBudget, name: e.target.value})} 
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Monthly Limit</label>
                <input 
                  type="number" 
                  style={{ width: '100%', boxSizing: 'border-box' }} 
                  placeholder="Limit Amount" 
                  required min="1" 
                  value={newBudget.limit} 
                  onChange={e => setNewBudget({...newBudget, limit: e.target.value})} 
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>Add Category</button>
          </form>
        </section>
      )}

      <section>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Allocated Limits</h3>
        {budgets.length === 0 ? (
          <div className="card glass" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>📉</span>
            <p style={{ marginTop: '1rem', color: 'hsl(var(--muted-foreground))' }}>You haven't defined any budget limits yet.</p>
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: '600', marginTop: '0.5rem' }}>Set up limits</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {budgets.map(budget => {
              const current = transactions.filter(t => t.category === budget.name).reduce((s,t) => s+t.amount, 0);
              const percentage = (current / budget.limit) * 100;
              const isOver = percentage > 100;

              return (
                <div key={budget.id} className="card glass" style={{ position: 'relative', borderTop: `4px solid ${isOver ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}` }}>
                  {isEditing && (
                    <button 
                      onClick={() => handleDeleteBudget(budget.id)} 
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete"
                    >✕</button>
                  )}
                  
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>{budget.name}</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
                      {currency}{current.toLocaleString()}
                    </span>
                    <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                      Limit: {currency}{budget.limit.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--secondary))', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      width: `${Math.min(percentage, 100)}%`, 
                      height: '100%', 
                      backgroundColor: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                      transition: 'width 1s ease-out'
                    }} />
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: isOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))', fontWeight: '500' }}>
                    {isOver ? `Over budget by ${currency}${(current - budget.limit).toLocaleString()}` : `${Math.round(percentage)}% used`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default BudgetsView;
