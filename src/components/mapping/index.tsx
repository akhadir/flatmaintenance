/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { BankTransaction } from '../../services/xlsjs';
import TransPreview from './trans-preview';
import { CatView } from './cat-view';
import mergeIcon from './merge-cells.svg';
import './index.css';

export type MappingProps = {
    xlsData: BankTransaction[];
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    }),
);
export const CellMergeIcon = () => {
    const classes = useStyles();
    return (
        <Typography className={classes.root}>
            <Link href="#" onClick={() => {}}>
                <img src={mergeIcon} alt="Map Selected" />
                <span className="icon-text"> Map Selected</span>
            </Link>
        </Typography>
    );
};
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
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="">
                            <em>Select a Filter</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
