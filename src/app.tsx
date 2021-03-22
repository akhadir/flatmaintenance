import React from 'react';
import OnlineTransactionParser from './components/online-transactions';
import './app.css';

const app:React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
          <img src="/images/ssfa.png" width="80px" height="60px" />
          <span>Suraksha Admin</span>
      </header>
      <div className="app-content">
        <p>
            Monthly Maintenance
        </p>
        <div>
          <OnlineTransactionParser />
        </div>
      </div>
    </div>
  );
}

export default app;
