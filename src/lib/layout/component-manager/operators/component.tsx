import React from 'react';
import BillConfig from '../../../../components/bill-config';
import store from '../../../../services/redux/store';
import { LayoutType } from '../../layout-types';

function component(layout: LayoutType, compMap: any) {
    const { type, key, compType } = layout;
    let comp: React.FC;
    let props: any;
    if (type === 'component') {
        if (key && compType) {
            switch (compType) {
            case 'bill-config':
                comp = BillConfig;
                props = layout.config;
                break;
            case 'something':
            default:
                comp = () => <></>;
                break;
            }
            if (typeof comp !== 'undefined') {
                compMap[key] = {
                    comp,
                    props,
                };
            }
        }
    }
    return layout;
}

export default component;
