import React, { memo, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import './cat-view.css';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});
export type catItem = {
    key: string;
    value?: any;
    label: string;
    children?: catItem[];
}
const flatNumbers = [
    '001', '002', '003', '004', '005', '007', '008', '009', '010', '011', '012',
    '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112',
    '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212',
    '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312',
    '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412',
];

const transCategories: catItem[] = [
    {
        key: 'maintenance',
        label: 'Maintenance',
        children: flatNumbers.map((val) => ({
            key: val,
            label: val,
        })),
    },
    {
        key: 'corpus',
        label: 'Corpus Fund',
        children: flatNumbers.map((val) => ({
            key: val,
            label: val,
        })),
    },
    {
        key: 'monthly',
        label: 'Monthly Expenses',
        children: [],
    },
];

export const CatView = () => {
    const classes = useStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const exp: string[] = [];
    const getTreeItem = useCallback((item: catItem, nodeId: string) => {
        exp.push(nodeId);
        let out;
        if (item.children && item.children.length) {
            const children = item.children.map((child, cindex) => getTreeItem(child, `${nodeId}${cindex}`));
            out = (
                <TreeItem key={nodeId} nodeId={nodeId} label={item.label}>
                    {children}
                </TreeItem>
            );
        } else {
            out = (<TreeItem key={nodeId} nodeId={nodeId} label={item.label} />);
        }
        return out;
    }, [exp]);
    const treeItem = transCategories.map((child, index) => getTreeItem(child, `${index}`));

    return (
        <div className="cat-view">
            <div className="cat-view-header">Categories</div>
            <TreeView
                className={classes.root}
                expanded={exp}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {treeItem}
            </TreeView>
        </div>
    );
};

export default memo(CatView);
