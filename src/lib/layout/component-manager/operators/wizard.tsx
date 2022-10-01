import React from 'react';
import { uniqueId } from 'lodash';
import { LayoutType } from '../../layout-types';
import Wizard from '../../../../components/wizard';
import store from '../../../../services/redux/store';
import { addEvents } from '../../../../services/redux/bills/bills-action';

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
                        store.dispatch(addEvents({
                            id: uniqueId('event'),
                            layout,
                            state: 'pending',
                            type: 'wizard:next',
                        }));
                    },
                    handleBack: () => {
                        store.dispatch(addEvents({
                            id: uniqueId('event'),
                            layout,
                            state: 'pending',
                            type: 'wizard:back',
                        }));
                    },
                },
            };
        }
    }
    return layout;
}

export default page;
