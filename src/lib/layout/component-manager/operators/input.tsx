import React from 'react';
import { Input } from '@material-ui/core';
import { LayoutType } from '../../layout-types';

function input(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'input') {
        if (key) {
            compMap[key] = {
                comp: Input,
                props: {
                    ...layout.config,
                },
            };
        }
    }
    return layout;
}

export default input;
