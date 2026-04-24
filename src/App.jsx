import React, { useState, useEffect } from "react";
import TransactionForm from "./Component/TransactionForm";
import TransactionList from "./Component/TransactionList";
import TransactionChart from "./Component/TransactionChart";
import DashboardCard from "./Component/DashboardCard";
import AnalyticsView from "./Component/AnalyticsView";
import BudgetsView from "./Component/BudgetsView";
import GoalsView from "./Component/GoalsView";
import ThemeToggle from "./Component/ThemeToggle";
import Login from "./Component/Auth/Login";
import Signup from "./Component/Auth/Signup";
import authService from "./appwrite/auth";
import appwriteService from "./appwrite/config";
import "./App.css";


function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newName, setNewName] = useState("");
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || '₹');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'signup'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userPrefs, setUserPrefs] = useState({ goals: [], budgets: [] });
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Handle currency change
  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('currency', newCurr);
  };

  // On mount: Check if user is logged in and setup Realtime
  useEffect(() => {
    authService.getCurrentUser()
      .then(async (userData) => {
        if (userData) {
          setUser(userData);
          setNewName(userData.name);
          fetchTransactions(userData.$id);
          const prefs = await authService.getPrefs();
          setUserPrefs({ 
            goals: prefs.goals ? JSON.parse(prefs.goals) : [], 
            budgets: prefs.budgets ? JSON.parse(prefs.budgets) : [] 
          });
        }
      })
      .finally(() => setLoading(false));

    // Realtime Subscription
    const unsubscribe = appwriteService.subscribe((response) => {
      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        setTransactions(prev => {
          // Prevent duplication if the transaction was already added locally
          if (prev.some(tx => tx.$id === response.payload.$id)) {
            return prev;
          }
          return [response.payload, ...prev];
        });
      } else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        setTransactions(prev => prev.filter(tx => tx.$id !== response.payload.$id));
      } else if (response.events.includes("databases.*.collections.*.documents.*.update")) {
        setTransactions(prev => prev.map(tx => tx.$id === response.payload.$id ? response.payload : tx));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateName = async () => {
    const updated = await authService.updateName(newName);
    if (updated) {
      setUser({ ...user, name: newName });
      alert("Name updated successfully!");
    }
  };

  const fetchTransactions = async (userid) => {
    const data = await appwriteService.getTransactions(userid);
    if (data) {
      setTransactions(data.documents);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setNewName(userData.name);
    fetchTransactions(userData.$id);
    const prefs = await authService.getPrefs();
    setUserPrefs({ 
      goals: prefs.goals ? JSON.parse(prefs.goals) : [], 
      budgets: prefs.budgets ? JSON.parse(prefs.budgets) : [] 
    });
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setTransactions([]);
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
  };

  const addTransaction = async (transaction) => {
    const newDoc = await appwriteService.createTransaction({
      ...transaction,
      userid: user.$id
    });
    if (newDoc) {
      setTransactions(prev => {
        if (prev.some(tx => tx.$id === newDoc.$id)) return prev;
        return [newDoc, ...prev];
      });
    }
  };

  const updateTransaction = async (id, updatedData) => {
    // Optimistic UI update
    setTransactions(prev => prev.map(tx => tx.$id === id ? { ...tx, ...updatedData } : tx));
    setEditingTransaction(null);
    const updated = await appwriteService.updateTransaction(id, updatedData);
    if (!updated) {
      fetchTransactions(user.$id); // Revert on fail
    }
  };

  const deleteTransaction = async (id) => {
    // Optimistic UI update
    setTransactions(prev => prev.filter(tx => tx.$id !== id));
    const success = await appwriteService.deleteTransaction(id);
    if (!success) {
      fetchTransactions(user.$id); // Revert on fail
    }
  };

  const updateUserPrefs = async (newPrefs) => {
    const updated = { ...userPrefs, ...newPrefs };
    setUserPrefs(updated);
    await authService.updatePrefs({
      goals: JSON.stringify(updated.goals),
      budgets: JSON.stringify(updated.budgets)
    });
  };

  // Dashboard calculations
  const totalIncome = transactions.reduce(
    (acc, tx) => tx.type === "income" ? acc + tx.amount : acc,
    0
  );
  const totalExpenses = transactions.reduce(
    (acc, tx) => tx.type === "expense" ? acc + tx.amount : acc,
    0
  );
  const balance = totalIncome - totalExpenses;

  const expenseData = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const existing = acc.find(item => item.name === tx.category);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({ name: tx.category || 'Other', value: tx.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--background))' }}>
        <div className="animate-in" style={{ textAlign: 'center' }}>
          <div className="glass card-gradient" style={{ width: '40px', height: '40px', borderRadius: '12px', margin: '0 auto 1rem' }} />
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading WealthWise...</p>
        </div>
      </div>
    );
  }

  // Auth pages if not logged in
  if (!user) {
    return authPage === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthPage('signup')} />
    ) : (
      <Signup onLogin={handleLogin} onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsView transactions={transactions} currency={currency} />;
      case 'budgets':
        return <BudgetsView transactions={transactions} currency={currency} userPrefs={userPrefs} updateUserPrefs={updateUserPrefs} />;
      case 'goals':
        return <GoalsView transactions={transactions} currency={currency} userPrefs={userPrefs} updateUserPrefs={updateUserPrefs} />;
      case 'settings':
        return (
          <div className="animate-in glass card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' }}>Profile Settings</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px', margin: '2rem auto 0' }}>
              <div className="card glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass card-gradient" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Display Name</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        style={{ flex: 1 }}
                      />
                      <button onClick={handleUpdateName} className="btn-primary" style={{ padding: '0 1.5rem', fontSize: '0.875rem' }}>Save</button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Account Email: <b>{user.email}</b></p>
                  </div>
                </div>
              </div>

              <div className="card glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: '600' }}>Currency Preference</p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Choose your preferred currency symbol</p>
                </div>
                <select 
                  value={currency} 
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  style={{ width: '80px', padding: '0.5rem', borderRadius: '8px' }}
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>

              <div className="card glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: '600' }}>Theme Preference</p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Choose between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Dashboard</h2>
                <p style={{ color: 'hsl(var(--muted-foreground))' }}>Welcome back, {user.name.split(' ')[0]}!</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', cursor: 'pointer' }}>🔔</span>
                <div 
                  className="glass" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => handleNavClick('settings')}
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User Profile" />
                </div>
              </div>
            </header>

            <section className="stats-grid">
              <DashboardCard title="Total Balance" amount={balance} type="primary" icon="🏦" trend={+2.4} currency={currency} />
              <DashboardCard title="Total Income" amount={totalIncome} type="income" icon="📈" trend={+12.5} currency={currency} />
              <DashboardCard title="Total Expenses" amount={totalExpenses} type="expense" icon="📉" trend={-4.3} currency={currency} />
            </section>

            <div className="dashboard-grid">
              <TransactionForm 
                addTransaction={addTransaction} 
                editingTransaction={editingTransaction} 
                updateTransaction={updateTransaction} 
                cancelEdit={() => setEditingTransaction(null)} 
                userPrefs={userPrefs}
              />
              <TransactionChart data={expenseData} currency={currency} />
            </div>

            <section style={{ marginTop: '2rem' }}>
              <TransactionList 
                transactions={transactions} 
                deleteTransaction={deleteTransaction} 
                editTransaction={setEditingTransaction}
                currency={currency} 
              />
            </section>
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glass card-gradient" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>💎</span>
          </div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: '700' }}>WealthWise</h1>
        </div>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="glass card-gradient" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>💎</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>WealthWise</h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '1rem' }}>
          <button 
            onClick={() => handleNavClick('dashboard')}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius)', 
              background: activeTab === 'dashboard' ? 'hsl(var(--primary) / 0.1)' : 'transparent', 
              color: activeTab === 'dashboard' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', 
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500',
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <span>🏠</span> <span>Dashboard</span>
          </button>
          <button 
            onClick={() => handleNavClick('analytics')}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius)', 
              background: activeTab === 'analytics' ? 'hsl(var(--primary) / 0.1)' : 'transparent', 
              color: activeTab === 'analytics' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', 
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500',
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <span>📊</span> <span>Analytics</span>
          </button>
          <button 
            onClick={() => handleNavClick('goals')}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius)', 
              background: activeTab === 'goals' ? 'hsl(var(--primary) / 0.1)' : 'transparent', 
              color: activeTab === 'goals' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', 
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500',
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <span>🏆</span> <span>Goals</span>
          </button>
          <button 
            onClick={() => handleNavClick('budgets')}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius)', 
              background: activeTab === 'budgets' ? 'hsl(var(--primary) / 0.1)' : 'transparent', 
              color: activeTab === 'budgets' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', 
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500',
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <span>💰</span> <span>Budgets</span>
          </button>
          <button 
            onClick={() => handleNavClick('settings')}
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius)', 
              background: activeTab === 'settings' ? 'hsl(var(--primary) / 0.1)' : 'transparent', 
              color: activeTab === 'settings' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))', 
              display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500',
              border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
            }}
          >
            <span>👤</span> <span>Profile</span>
          </button>
        </nav>
        
        <div className="glass animate-in" style={{ marginTop: 'auto', padding: '1rem', borderRadius: 'var(--radius)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>Cloud Sync Active</p>
          <button 
            onClick={handleLogout}
            className="btn-primary" 
            style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center', background: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;