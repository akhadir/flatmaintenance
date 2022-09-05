import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from '@reach/router';
import OnlineTransactionParser from './online';
import Categorizer from './categorizer';
import ImageParser from './components/image-parser';
import './index.css';
// import reportWebVitals from './reportWebVitals';

const Home = (props: any) => <OnlineTransactionParser />;
const Cat = (props: any) => <Categorizer />;
const Bills = (props: any) => <ImageParser />;
ReactDOM.render(
    <React.StrictMode>
        <header className="app-header">
            <img src="/images/ssfa.png" alt="Suraksha Sunflower Apartment" width="80px" height="60px" />
            <span>Suraksha Sunflower </span>
            <nav className="nav-bar">
                <Link to="/">Parse Online</Link> |{' '}
                <Link to="cat">Categorize Transactions</Link> |{' '}
                <Link to="bills">Upload Bills</Link>
            </nav>
        </header>
        <Router>
            <Home path="/" />
            <Cat path="cat" />
            <Bills path="bills" />
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);

export default {};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
