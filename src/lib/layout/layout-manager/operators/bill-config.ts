import store from '../../../../services/redux/store';
import { LayoutType } from '../../layout-types';

function billComp(layout: LayoutType) {
    const { config } = store.getState().bills;
    if (layout.compType === 'bill-config') {
        layout.children?.forEach((child: LayoutType) => {
            const { name } = child.config;
            switch (name) {
            case 'listURL':
                child.config.value = config.listURL;
                break;
            case 'fetchURL':
                child.config.value = config.fetchURL;
                break;
            case 'downloadURL':
                child.config.value = config.downloadURL;
                break;
            case 'updateURL':
                child.config.value = config.updateURL;
                break;
            default:
                break;
            }
        });
    }
    return layout;
}

export default billComp;
