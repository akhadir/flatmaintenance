import React from 'react';
import { Provider } from 'react-redux';
import store from './services/redux/store';
import Categorizer from './components/categorizer';
import './app.css';

const App: React.FC = () => (
    <div className="app">
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
