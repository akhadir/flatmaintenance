import React from 'react';
import { LayoutType } from '../../layout-types';

function page(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'page') {
        if (key) {
            compMap[key] = {
                comp: ({ children }: any) => (<div className="page">{children}</div>),
                props: {},
            };
        }
    }
    return layout;
}

export default page;
