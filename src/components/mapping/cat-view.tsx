import React, {
    memo, useCallback, useEffect, useState, useContext,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import gsheetUtil from '../../services/googleapi';
import { catItem } from '../../services/service-types';
import './cat-view.css';
import AppContext from '../../services';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export const CatView = () => {
    const classes = useStyles();
    const { appData } = useContext(AppContext);
    const { transCategories } = appData;
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
