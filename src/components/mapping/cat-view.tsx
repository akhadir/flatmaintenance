import React, {
    memo, useCallback, useEffect, useState, useContext,
} from 'react';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';
import { CatItem } from '../../services/service-types';
import AppContext from '../../services';
import transSheet from '../../services/sheet';
import './cat-view.css';

export const CatView = () => {
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
