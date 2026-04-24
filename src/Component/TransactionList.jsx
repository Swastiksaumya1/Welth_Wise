import React, { useState } from "react";
import TransactionItem from "./TransactionItem";

function TransactionList({ transactions, deleteTransaction, editTransaction, currency }) {
  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.type === filter;
  }).sort((a, b) => new Date(b.$createdAt || 0) - new Date(a.$createdAt || 0)); // Newest first

  return (
    <div className="card glass" style={{ marginTop: '2rem', flex: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Recent Activity</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: filter === f ? 'hsl(var(--primary))' : 'transparent',
                color: filter === f ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="transaction-list" style={{ maxHeight: "450px", overflowY: "auto", paddingRight: '0.5rem' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'hsl(var(--muted-foreground))' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem 
              key={tx.$id} 
              transaction={tx} 
              onDelete={deleteTransaction} 
              onEdit={editTransaction}
              currencySymbol={currency}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;