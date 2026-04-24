import React, { useState } from 'react';

function GoalsView({ transactions, currency = '₹', userPrefs, updateUserPrefs }) {
  const goals = userPrefs?.goals || [];
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '', color: 'hsl(var(--primary))' });
  
  // State to track which goal is currently being actively updated (funds added/deducted) or edited (details changed)
  const [activeFundGoalId, setActiveFundGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({ name: '', target: '', current: '', color: '' });

  const totalTarget = goals.reduce((s, g) => s + Number(g.target), 0);
  const totalCurrent = goals.reduce((s, g) => s + Number(g.current), 0);
  const totalProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    const added = { 
      id: Date.now(), 
      name: newGoal.name,
      target: Number(newGoal.target), 
      current: Number(newGoal.current) || 0,
      color: newGoal.color
    };
    updateUserPrefs({ goals: [...goals, added] });
    setNewGoal({ name: '', target: '', current: '', color: 'hsl(var(--primary))' });
    setIsEditingGlobal(false);
  };

  const handleDeleteGoal = (id) => {
    updateUserPrefs({ goals: goals.filter(g => g.id !== id) });
  };

  const handleFundSubmit = (e, id, type) => {
    e.preventDefault();
    const amount = Number(fundAmount);
    if (!amount || amount <= 0) return;
    
    const updated = goals.map(g => {
      if (g.id === id) {
        let newCurrent = type === 'add' ? g.current + amount : g.current - amount;
        if (newCurrent < 0) newCurrent = 0;
        return { ...g, current: newCurrent };
      }
      return g;
    });
    
    updateUserPrefs({ goals: updated });
    setFundAmount('');
    setActiveFundGoalId(null);
  };

  const startEditingGoal = (goal) => {
    setEditingGoalId(goal.id);
    setEditGoalData({ ...goal });
  };

  const saveEditedGoal = (e) => {
    e.preventDefault();
    const updated = goals.map(g => g.id === editingGoalId ? { ...editGoalData, target: Number(editGoalData.target), current: Number(editGoalData.current) } : g);
    updateUserPrefs({ goals: updated });
    setEditingGoalId(null);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '3rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Life Milestones</h2>
          <button 
            className="btn-primary" 
            onClick={() => setIsEditingGlobal(!isEditingGlobal)}
            style={{ padding: '0.6rem 1.25rem', borderRadius: '50px' }}
          >
            {isEditingGlobal ? 'Cancel Creation' : '+ New Milestone'}
          </button>
        </div>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Visualize and fund your long-term dreams dynamically.</p>
      </header>

      {/* Massive Hero Section */}
      <section className="card glass animate-in" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(145deg, hsl(var(--primary) / 0.1) 0%, transparent 100%)', border: '1px solid hsl(var(--primary) / 0.2)' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--primary))', marginBottom: '1rem', fontWeight: '600' }}>
          Master Progress
        </h3>
        
        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--primary))" strokeWidth="12" 
              strokeDasharray="565.48" strokeDashoffset={565.48 - (565.48 * totalProgress) / 100} 
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} strokeLinecap="round" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
            <span style={{ fontSize: '3rem', fontWeight: '800', color: 'hsl(var(--foreground))', lineHeight: '1' }}>{totalProgress}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Saved</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{currency}{totalCurrent.toLocaleString()}</p>
          </div>
          <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))' }}></div>
          <div>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Target Goal</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{currency}{totalTarget.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {isEditingGlobal && (
        <section className="animate-in" style={{ marginBottom: '2rem' }}>
          <form 
            onSubmit={handleAddGoal} 
            className="card glass"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px dashed hsl(var(--primary))', background: 'hsl(var(--primary) / 0.02)' }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Define New Milestone</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Milestone Name</label>
                <input style={{ width: '100%', boxSizing: 'border-box' }} placeholder="e.g. Dream House" required value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Visual Theme</label>
                <select style={{ width: '100%', boxSizing: 'border-box' }} value={newGoal.color} onChange={e => setNewGoal({...newGoal, color: e.target.value})}>
                  <option value="hsl(var(--primary))">Ocean Blue</option>
                  <option value="hsl(142, 70%, 45%)">Emerald Green</option>
                  <option value="hsl(35, 92%, 50%)">Sunset Orange</option>
                  <option value="hsl(280, 70%, 55%)">Amethyst Purple</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Target Amount</label>
                <input type="number" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Amount" required min="1" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Initial Deposit</label>
                <input type="number" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Current Saved" min="0" value={newGoal.current} onChange={e => setNewGoal({...newGoal, current: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Milestone</button>
          </form>
        </section>
      )}

      <section>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Your Milestones</h3>
        {goals.length === 0 ? (
          <div className="card glass" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>⛰️</span>
            <p style={{ marginTop: '1rem', color: 'hsl(var(--muted-foreground))' }}>You haven't added any milestones.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {goals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const isCompleted = progress >= 100;
              const isEditingThis = editingGoalId === goal.id;
              const isFundingThis = activeFundGoalId === goal.id;

              return (
                <div key={goal.id} className="card glass hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
                  {isCompleted && !isEditingThis && (
                    <div style={{ position: 'absolute', top: '1.5rem', right: '-2rem', background: 'hsl(var(--success))', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.25rem 2.5rem', transform: 'rotate(45deg)', letterSpacing: '1px' }}>
                      ACHIEVED
                    </div>
                  )}

                  {isEditingThis ? (
                    <form onSubmit={saveEditedGoal} className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>Edit Milestone</h4>
                        <button type="button" onClick={() => handleDeleteGoal(goal.id)} className="hover-danger" style={{ background: 'none', border: 'none', color: 'hsl(var(--destructive))', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>Delete Goal</button>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Name</label>
                          <input style={{ width: '100%', boxSizing: 'border-box' }} required value={editGoalData.name} onChange={e => setEditGoalData({...editGoalData, name: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Target {currency}</label>
                          <input type="number" style={{ width: '100%', boxSizing: 'border-box' }} required min="1" value={editGoalData.target} onChange={e => setEditGoalData({...editGoalData, target: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Current {currency}</label>
                          <input type="number" style={{ width: '100%', boxSizing: 'border-box' }} required min="0" value={editGoalData.current} onChange={e => setEditGoalData({...editGoalData, current: e.target.value})} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Save</button>
                        <button type="button" onClick={() => setEditingGoalId(null)} style={{ background: 'none', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${goal.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: goal.color }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{goal.name}</h4>
                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                              {currency}{goal.current.toLocaleString()} / {currency}{goal.target.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <button onClick={() => startEditingGoal(goal)} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'color 0.2s' }} title="Edit Goal Details">
                          ✏️
                        </button>
                      </div>

                      <div style={{ width: '100%', height: '8px', backgroundColor: 'hsl(var(--secondary))', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          backgroundColor: goal.color,
                          transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: goal.color }}>{progress.toFixed(1)}% Completed</span>
                        
                        {!isCompleted && !isFundingThis && (
                          <button 
                            onClick={() => setActiveFundGoalId(goal.id)} 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'hsl(var(--secondary))', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: 'hsl(var(--foreground))' }}
                          >
                            Update Funds 💰
                          </button>
                        )}

                        {isFundingThis && (
                          <div className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(var(--secondary) / 0.5)', padding: '0.5rem', borderRadius: '8px' }}>
                            <input 
                              type="number" 
                              placeholder="Amount" 
                              min="1"
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              style={{ width: '100px', padding: '0.4rem', border: '1px solid hsl(var(--border))' }}
                              autoFocus
                            />
                            <button onClick={(e) => handleFundSubmit(e, goal.id, 'add')} style={{ background: 'hsl(var(--success))', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                            <button onClick={(e) => handleFundSubmit(e, goal.id, 'deduct')} style={{ background: 'hsl(var(--destructive))', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                            <button onClick={() => {setActiveFundGoalId(null); setFundAmount('');}} style={{ background: 'none', color: 'hsl(var(--muted-foreground))', border: 'none', padding: '0.4rem', cursor: 'pointer' }}>✕</button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default GoalsView;

