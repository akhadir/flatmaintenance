import React from 'react';
import { LayoutType } from '../../layout-types';

function page(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'page') {
        if (key) {
            compMap[key] = {
                comp: ({ children }: any) => (<div>{children}</div>),
                props: {},
            };
        }
    }
}

export default page;
