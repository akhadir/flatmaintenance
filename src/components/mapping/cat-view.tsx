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
import { CatItem } from '../../services/service-types';
import AppContext from '../../services';
import TransSheet from '../../services/sheet';
import './cat-view.css';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});
const transSheet = new TransSheet();
export const CatView = () => {
    const classes = useStyles();
    const { appData } = useContext(AppContext);
    const { transCategories } = appData;
    const [categories, setCategories] = useState<CatItem[]>([]);
    const getTreeItem = useCallback((item: CatItem, nodeId: string) => {
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
            const catList = await transSheet.getExpenseCategories();
            await gsheetUtil.init();
            transCategories[2].children = catList;
            setCategories([...transCategories]);
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
