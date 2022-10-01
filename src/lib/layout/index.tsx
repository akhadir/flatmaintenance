import React, { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LinearProgress } from '@mui/material';
import { LayoutProps, LayoutType } from './layout-types';
import componentManager from './component-manager';
import layoutManager from './layout-manager';

export const LayoutRenderer = (props: LayoutProps) => {
    const { layout } = props;
    const [componentMap, setComponentMap] = useState<any>(undefined);
    useEffect(() => {
        layoutManager(layout, (uLayout) => {
            componentManager(uLayout, (compMap) => {
                setComponentMap(compMap);
            });
        });
    }, [layout]);
    const renderLayout = useCallback(
        (comp: LayoutType) => {
            if (componentMap) {
                let out;
                const { key, noShow } = comp;
                if (key && !noShow) {
                    if (componentMap[key]) {
                        let children;
                        if (comp.children) {
                            children = comp.children.filter((child) => !child.noShow).map(renderLayout);
                        }
                        if (!children) {
                            children = <></>;
                        }
                        const { comp: Comp, props: compProps } = componentMap[key];
                        out = (
                            <Comp key={key} {...compProps}>
                                {children}
                            </Comp>
                        );
                    } else {
                        out = <LinearProgress key={`loader-${key}`} />;
                    }
                } else {
                    out = <></>;
                }
                return out;
            }
            return '';
        },
        [componentMap],
    );
    return <div>{layout ? renderLayout(layout) : <CircularProgress />}</div>;
};

export default LayoutRenderer;
