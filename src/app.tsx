import React from 'react';
import { Provider } from 'react-redux';
import store from './services/redux/store';
// import OnlineTransactionParser from './components/online-transactions';
import './app.css';
import Categorizer from './components/categorizer';

const App: React.FC = () => (
    <div className="app">
        <header className="app-header">
            <img src="/images/ssfa.png" alt="Suraksha Sunflower Apartment" width="80px" height="60px" />
            <span>Suraksha Sunflower - Admin</span>
        </header>
        <div className="app-content">
            {/* <h3>
                Monthly Maintenance
            </h3> */}
            <div>
                <Provider store={store}>
                    {/* <OnlineTransactionParser /> */}
                    <Categorizer />
                </Provider>
            </div>
        </div>
    </div>
);

export default App;
