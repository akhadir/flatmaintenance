import React from 'react';
import Field from '../../../../components/field';
import { LayoutType } from '../../layout-types';

function field(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'field') {
        if (key) {
            compMap[key] = {
                comp: Field,
                props: {
                    ...layout.config,
                },
            };
        }
    }
    return layout;
}

export default field;
