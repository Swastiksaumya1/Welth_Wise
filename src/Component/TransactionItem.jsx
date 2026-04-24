import React from 'react';

function TransactionItem({ transaction, onDelete, onEdit, currencySymbol = '₹' }) {
  const isIncome = transaction.type === 'income';
  
  const formattedAmount = `${currencySymbol}${transaction.amount.toLocaleString()}`;

  return (
    <div className="transaction-item animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="glass" style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: isIncome ? 'hsl(var(--success) / 0.1)' : 'hsl(var(--destructive) / 0.1)'
        }}>
          <span style={{ fontSize: '1.25rem' }}>{isIncome ? '📥' : '📤'}</span>
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '500' }}>{transaction.text}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span className={`badge badge-${transaction.type}`}>{transaction.category || 'Other'}</span>
            <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem' }}>{transaction.date}</span>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <p style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: isIncome ? 'hsl(var(--success))' : 'hsl(var(--destructive))' 
        }}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </p>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            onClick={() => onEdit(transaction)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'hsl(var(--muted-foreground))',
              transition: 'all 0.2s'
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(transaction.$id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'hsl(var(--muted-foreground))',
              transition: 'all 0.2s'
            }}
            className="hover-danger"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;
