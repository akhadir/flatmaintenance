import React from 'react';
import { Provider } from 'react-redux';
import store from './services/redux/store';
import Categorizer from './components/categorizer';
import './app.css';

const App: React.FC = () => (
    <div className="app">
        <header className="app-header">
            <img src="/images/ssfa.png" alt="Suraksha Sunflower Apartment" width="80px" height="60px" />
            <span>Suraksha Sunflower - Admin</span>
        </header>
        <div className="app-content">
            <div>
                <Provider store={store}>
                    <Categorizer />
                </Provider>
            </div>
        </div>
    </div>
);

export default App;
