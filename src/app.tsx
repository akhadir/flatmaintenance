import React, { useState, useEffect } from 'react';
import { Router, Link } from '@reach/router';
import { Provider } from 'react-redux';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import Alert from '@material-ui/lab/Alert';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ProSidebar, Menu, MenuItem, SidebarFooter } from 'react-pro-sidebar';
import store from './services/redux/store';
import OnlineTransactionParser from './workspaces/online';
import Categorizer from './workspaces/categorizer';
import BillParser from './workspaces/new-bills';
import CashTransactions from './workspaces/cash';
import SecretDialog from './components/mapping/secret-dialog';
import { getConfig, setCredentials } from './services';
import './app.css';
import 'react-pro-sidebar/dist/css/styles.css';

const Home = (props: any) => <OnlineTransactionParser />;
const Cat = (props: any) => <Categorizer />;
const Bills = (props: any) => <BillParser />;
const Cash = (props: any) => <CashTransactions />;

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
            <header className="app-header">
                <img src="/images/ssfa.png" alt="Suraksha Sunflower Apartment" width="80px" height="60px" />
                <span>Suraksha Sunflower </span>
                {/* <nav className="nav-bar">
                    <Link to="/">Parse Online</Link> |{' '}
                    <Link to="cat">Categorize Transactions</Link> |{' '}
                    <Link to="bills">Upload Bills</Link> |{' '}
                    <Link to="cash">Cash Transactions</Link>
                </nav> */}
            </header>
            <div className="app">
                <ProSidebar collapsed={collapsed}>
                    <Menu iconShape="circle">
                        <MenuItem icon={<HomeIcon />} title="Parse Online Transactions">
                            <Link to="/">Parse Online Transactions</Link>
                        </MenuItem>
                        <MenuItem icon={<CategoryIcon />} title="Categorize Transactions">
                            <Link to="cat">Categorize Transactions</Link>
                        </MenuItem>
                        <MenuItem icon={<ReceiptIcon />} title="Upload Bills">
                            <Link to="bills">Upload Bills</Link>
                        </MenuItem>
                        <MenuItem icon={<CurrencyRupeeIcon />} title="Cash Transactions">
                            <Link to="cash">Cash Transactions</Link>
                        </MenuItem>
                        {/* <SubMenu title="Components">
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </SubMenu> */}
                    </Menu>
                    <SidebarFooter className="sb-footer">
                        {!collapsed &&
                            <KeyboardDoubleArrowLeftIcon onClick={() => setCollapsed(true)} />}
                        {collapsed &&
                            <KeyboardDoubleArrowRightIcon onClick={() => setCollapsed(false)} />}
                    </SidebarFooter>
                </ProSidebar>
                <div className="workspace">
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    {!secretSuccess && (
                        <SecretDialog errorMsg={errorMsg} handleSecret={setSecret} />
                    )}
                    {secretSuccess && (
                        <Router>
                            <Home path="/" />
                            <Cat path="cat" />
                            <Bills path="bills" />
                            <Cash path="cash" />
                        </Router>
                    )}
                </div>
            </div>
        </Provider>
    );
}

export default App;
