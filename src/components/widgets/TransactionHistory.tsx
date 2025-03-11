
import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown, Filter, Search, Settings, CreditCard, Banknote, Wallet } from 'lucide-react';

// Sample transaction data
const transactionData = [
  { 
    id: 'transfer-1', 
    type: 'transfer', 
    description: 'Перевод денег между счетами', 
    amount: '-500 000 ₽', 
    isNegative: true,
    date: 'Сегодня', 
    time: '16:23', 
    account: 'Спекулятивный счёт'
  },
  { 
    id: 'deposit-1', 
    type: 'deposit', 
    description: 'Пополнение счета', 
    amount: '500 000 ₽', 
    isNegative: false,
    date: 'Сегодня', 
    time: '16:23', 
    account: 'Спекулятивный счёт'
  },
  { 
    id: 'tax-1', 
    type: 'tax', 
    description: 'Корректировка налога', 
    amount: '1 026 ₽', 
    isNegative: false,
    date: '20 января 2025', 
    time: '23:35', 
    account: 'Спекулятивный счёт'
  },
  { 
    id: 'tax-2', 
    type: 'tax', 
    description: 'Удержание налога', 
    amount: '-25 873 ₽', 
    isNegative: true,
    date: '01 января 2025', 
    time: '01:57', 
    account: 'Спекулятивный счёт'
  },
  { 
    id: 'fee-1', 
    type: 'fee', 
    description: 'Списание вариационной маржи', 
    amount: '-5,47 ₽', 
    isNegative: true,
    date: '13 сентября 2024', 
    time: '19:03', 
    account: 'Спекулятивный счёт'
  },
];

const TransactionHistoryWidget: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const getIconForTransactionType = (type: string) => {
    switch (type) {
      case 'transfer': return <Wallet size={20} className="text-blue-400" />;
      case 'deposit': return <Banknote size={20} className="text-green-400" />;
      case 'tax': return <Wallet size={20} className="text-gray-400" />;
      case 'fee': return <Wallet size={20} className="text-red-400" />;
      default: return <Wallet size={20} className="text-terminal-muted" />;
    }
  };
  
  // Group transactions by date
  const groupedTransactions: Record<string, typeof transactionData> = {};
  transactionData.forEach(transaction => {
    if (!groupedTransactions[transaction.date]) {
      groupedTransactions[transaction.date] = [];
    }
    groupedTransactions[transaction.date].push(transaction);
  });
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-terminal-muted" />
          </div>
          <input
            type="text"
            className="bg-terminal-accent/30 border border-terminal-border rounded-md py-2 pl-10 pr-3 text-sm w-64"
            placeholder="Деньги не спят: История операций"
            readOnly
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded hover:bg-terminal-accent/50">
            <Settings size={16} className="text-terminal-muted" />
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date} className="mb-4">
            <div className="text-sm font-medium mb-2">{date}</div>
            
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center py-3 border-b border-terminal-border/20 hover:bg-terminal-accent/10"
              >
                <div className="mr-3 p-1 rounded-full bg-terminal-accent/30">
                  {getIconForTransactionType(transaction.type)}
                </div>
                
                <div className="flex-grow">
                  <div className="text-sm">{transaction.description}</div>
                  <div className="text-xs text-terminal-muted">{transaction.account}</div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm ${transaction.isNegative ? 'text-terminal-negative' : 'text-terminal-positive'}`}>
                    {transaction.amount}
                  </div>
                  <div className="text-xs text-terminal-muted">{transaction.time}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryWidget;
