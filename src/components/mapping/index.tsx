/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Typography, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import TransPreview from './trans-preview';
import { CatView } from './cat-view';
import mergeIcon from './merge-cells.svg';
import { Transaction } from '../../services/service-types';
import './index.css';

export type MappingProps = {
    xlsData: Transaction[];
}

export const CellMergeIcon = () => (
    <Typography>
        <Link to="#" onClick={() => {}}>
            <img src={mergeIcon} alt="Map Selected" />
            <span className="icon-text"> Map Selected</span>
        </Link>
    </Typography>
);
export const Mapping = (props: MappingProps) => {
    console.log(props);
    return (
        <>
            <p>Map transactions to the corresponding category.</p>
            <div className="action-wrapper">
                <div className="action-bar">
                    <Select
                        value=""
                        onChange={() => {}}
                        displayEmpty
                        className="mapping-filter"
                        inputProps={{ 'aria-label': 'Mapping Filter' }}
                    >
                        <MenuItem value="">
                            <em>All Transactions</em>
                        </MenuItem>
                        <MenuItem value="mapped">Only Mapped</MenuItem>
                        <MenuItem value="unmapped">Only Unmapped</MenuItem>
                    </Select>
                </div>
                <div>
                    <CellMergeIcon />
                </div>
            </div>
            <div className="mapping-wrapper">
                <TransPreview xlsData={props.xlsData} />
                <CatView />
            </div>
        </>
    );
};

export default Mapping;
