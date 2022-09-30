import React from 'react';
import { LayoutType } from '../../layout-types';
import Wizard from '../../../../components/wizard';

function page(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'wizard') {
        if (key) {
            compMap[key] = {
                comp: Wizard,
                props: {
                    steps: layout.config.steps,
                    isStepOptional: layout.config.isStepOptional,
                },
            };
        }
    }
    return layout;
}

export default page;
