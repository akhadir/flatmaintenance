import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { Provider } from 'react-redux';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import HandymanIcon from '@mui/icons-material/Handyman';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import store from './services/redux/store';
import SecretDialog from './components/mapping/secret-dialog';
import { getConfig, setCredentials } from './services';
import AppRoutes from './app-routes';
import './app.css';

function App() {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [secret, setSecret] = useState('');
    const [secretSuccess, setSecretSuccess] = useState<boolean>(!!getConfig().secret);
    useEffect(() => {
        if (secret) {
            const out = setCredentials(secret);
            if (!out.res) {
                setErrorMsg('Wrong secret. Enter it again.');
                setSecret('');
            } else {
                setErrorMsg('');
                setSecretSuccess(true);
            }
        }
    }, [secret]);
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Provider store={store}>
            <BrowserRouter>
                <header className="app-header">
                    <img src="/images/ssfa.png" alt="Suraksha Sunflower Apartment" width="80px" height="60px" />
                    <span>Suraksha Sunflower </span>
                </header>
                <div className="app">
                    <Sidebar collapsed={collapsed}>
                        <Menu>
                            <MenuItem icon={<HomeIcon />} title="Parse Online Transactions">
                                <Link to="/">Parse Online Transactions</Link>
                            </MenuItem>
                            <MenuItem icon={<CategoryIcon />} title="Categorize Transactions">
                                <Link to="/cat">Categorize Transactions</Link>
                            </MenuItem>
                            <MenuItem icon={<ReceiptIcon />} title="Upload Bills">
                                <Link to="/bills">Process Bills</Link>
                            </MenuItem>
                            {/* <MenuItem icon={<CurrencyRupeeIcon />} title="Cash Transactions">
                                <Link to="/cash">Cash Transactions</Link>
                            </MenuItem> */}
                            <MenuItem icon={<HandymanIcon />} title="Generate Encrypted Keys">
                                <Link to="/gen-key">Encrypt Keys</Link>
                            </MenuItem>
                            <MenuItem icon={<SettingsIcon />} title="Settings">
                                <Link to="/settings">Settings</Link>
                            </MenuItem>
                            {/* <SubMenu title="Components">
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </SubMenu> */}
                        </Menu>
                        <div className="sb-footer">
                            {!collapsed &&
                            <KeyboardDoubleArrowLeftIcon onClick={() => setCollapsed(true)} />}
                            {collapsed &&
                            <KeyboardDoubleArrowRightIcon onClick={() => setCollapsed(false)} />}
                        </div>
                    </Sidebar>
                    <div className="workspace">
                        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                        {!secretSuccess && (
                            <SecretDialog errorMsg={errorMsg} handleSecret={setSecret} />
                        )}
                        {secretSuccess && <AppRoutes />}
                    </div>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
