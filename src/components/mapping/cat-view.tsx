import React, {
    memo, useCallback, useEffect, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import gsheetUtil from '../../services/googleapi';
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
    const [categories, setCategories] = useState<catItem[]>([]);
    // const exp: string[] = [];
    const getTreeItem = useCallback((item: catItem, nodeId: string) => {
        // exp.push(nodeId);
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
    }, []);
    const treeItem = categories.map((child, index) => getTreeItem(child, `${index}`));
    useEffect(() => {
        (async () => {
            await gsheetUtil.init();
            await gsheetUtil.getSheetByTitle('Summary');
            const sheetCol = gsheetUtil.getColumn(0);
            const expList = sheetCol.map((col) => col.value);
            const stopRowVal = 'Total Expense';
            const filteredExpList = [];
            for (let i = 1; i < expList.length - 1; i += 1) {
                if (expList[i] !== stopRowVal) {
                    filteredExpList.push(expList[i]);
                    transCategories[2].children = filteredExpList.map((expense: any) => ({
                        key: expense,
                        label: expense,
                    }));
                    setCategories([...transCategories]);
                } else {
                    break;
                }
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="cat-view">
            <div className="cat-view-header">Categories</div>
            {categories.length ? (
                <div className="cat-tree">
                    <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {treeItem}
                    </TreeView>
                </div>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
};

export default memo(CatView);
