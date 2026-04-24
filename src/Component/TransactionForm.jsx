import React, { useState, useEffect } from "react";

function TransactionForm({ addTransaction, editingTransaction, updateTransaction, cancelEdit, userPrefs }) {
  const [formData, setFormData] = useState({
    text: "",
    amount: "",
    type: "expense",
    category: "Food"
  });

  const defaultExpenseCategories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Other"];
  const budgetCategories = userPrefs?.budgets?.map(b => b.name) || [];
  const mergedExpenses = Array.from(new Set([...defaultExpenseCategories, ...budgetCategories]));

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
    expense: mergedExpenses
  };

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        text: editingTransaction.text || "",
        amount: editingTransaction.amount || "",
        type: editingTransaction.type || "expense",
        category: editingTransaction.category || "Food"
      });
      // Scroll the correct container to top smoothly so user sees the form
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setFormData({ text: "", amount: "", type: "expense", category: "Food" });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData({ 
        ...formData, 
        [name]: value, 
        category: categories[value][0] 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.text || formData.amount <= 0) {
      alert("Please enter a valid title and amount");
      return;
    }

    const payload = {
      text: formData.text,
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: editingTransaction ? editingTransaction.date : new Date().toLocaleDateString('en-GB')
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.$id, payload);
    } else {
      addTransaction({ ...payload, id: Date.now() });
    }
    
    setFormData({ text: "", amount: "", type: "expense", category: "Food" });
  };

  return (
    <div className="card glass animate-in" style={{ flex: 1, border: editingTransaction ? '1px solid hsl(var(--primary))' : '' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
        {editingTransaction && (
          <button onClick={cancelEdit} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Transaction Label</label>
          <input
            name="text"
            placeholder="e.g. Monthly Grocery"
            value={formData.text}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Amount</label>
            <input
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%' }}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
          {editingTransaction ? "Save Changes" : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;