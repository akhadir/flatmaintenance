import { LayoutType } from '../../layout-types';

function wizard(layout: LayoutType) {
    if (layout.type === 'wizard') {
        if (!layout.config.activeStep) {
            layout.config.activeStep = 0;
        }
        const { activeStep } = layout.config;
        layout.children?.forEach((child, index) => {
            if (index !== activeStep) {
                child.noShow = true;
            }
        });
    }
    return layout;
}

export default wizard;
