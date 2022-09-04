import React from 'react';
import { Provider } from 'react-redux';
import store from './services/redux/store';
import OnlineTransactionParser from './components/online-transactions';
import './app.css';

const App: React.FC = () => (
    <div className="app">
        <div className="app-content">
            <div>
                <Provider store={store}>
                    <OnlineTransactionParser />
                </Provider>
            </div>
        </div>
    </div>
);

export default App;
