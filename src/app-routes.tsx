import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CashTransactions from './workspaces/cash';
import Categorizer from './workspaces/categorizer';
import BillParser from './workspaces/new-bills';
import OnlineTransactionParser from './workspaces/online';
import KeyGen from './workspaces/key';

function AppRoutes() {
    return (
        <Routes>
            <Route>
                <Route path="/" element={<OnlineTransactionParser />} />
                <Route path="/cat" element={<Categorizer />} />
                <Route path="/bills" element={<BillParser />} />
                <Route path="/cash" element={<CashTransactions />} />
                <Route path="/gen-key" element={<KeyGen />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
