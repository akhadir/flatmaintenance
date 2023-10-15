import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, LinearProgress } from '@mui/material';
import { LayoutProps, LayoutType } from './layout-types';
import componentManager from './component-manager';
import eventManager from './event-manager';
import { runLayout } from './layout-manager';

export const LayoutRenderer = (props: LayoutProps) => {
    const { layout } = props;
    const events: any[] = useSelector((state: any) => state.bills.events);
    const [componentMap, setComponentMap] = useState<any>(undefined);
    useEffect(() => {
        runLayout(layout, (uLayout) => {
            componentManager(uLayout, (compMap) => {
                setComponentMap(compMap);
            });
        });
    }, [layout]);
    useEffect(() => {
        eventManager(events.pop(), () => {});
    }, [events]);
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
