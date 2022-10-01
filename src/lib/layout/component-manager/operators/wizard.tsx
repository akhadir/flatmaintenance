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
                    activeStep: layout.config.activeStep,
                    steps: layout.config.steps,
                    handleNext: () => {
                        console.log('Handle Next');
                    },
                    handleBack: () => {
                        console.log('Handle Back');
                    },
                },
            };
        }
    }
    return layout;
}

export default page;
