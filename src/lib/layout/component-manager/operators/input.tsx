import React from 'react';
import { LayoutType } from '../../layout-types';
import { runLayout } from '../../layout-manager';
import FieldInput from '../../../../components/input';

function input(layout: LayoutType, compMap: any) {
    const { type, key } = layout;
    if (type === 'input') {
        if (key) {
            compMap[key] = {
                comp: FieldInput,
                props: {
                    ...layout.config,
                    onBlur: (e: any) => {
                        const { value } = e.target;
                        if (!value) {
                            if (layout.parent) {
                                layout.parent.config.errors = ['Enter a value'];
                                runLayout(layout.parent);
                            }
                        } else if (layout.parent && layout.parent.config.errors) {
                            layout.parent.config.errors = [];
                            layout.parent.config.value = value;
                            runLayout(layout.parent);
                        }
                    },
                },
            };
        }
    }
    return layout;
}

export default input;
