import { uniqueId } from 'lodash';
import { LayoutType } from '../../layout-types';

function component(layout: LayoutType, compMap: any) {
    if (!layout.key) {
        layout.key = uniqueId(layout.type);
    }
    return layout;
}

export default component;
