import React, { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LinearProgress } from '@mui/material';
import { LayoutProps, LayoutType } from './layout-types';
import componentManager from './component-manager';

export const LayoutRenderer = (props: LayoutProps) => {
    const { layout } = props;
    const [componentMap, setComponentMap] = useState<any>(undefined);
    useEffect(() => {
        componentManager(layout, (compMap) => {
            setComponentMap(compMap);
        });
    }, [layout]);
    const renderLayout = useCallback(
        (comp: LayoutType) => {
            if (componentMap) {
                let out;
                const { key } = comp;
                if (key) {
                    if (componentMap[key]) {
                        let children;
                        if (comp.children) {
                            children = comp.children.map(renderLayout);
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
                        out = <CircularProgress key={`loader-${key}`} />;
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
    return <div>{layout ? renderLayout(layout) : <LinearProgress />}</div>;
};

export default LayoutRenderer;
