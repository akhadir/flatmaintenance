import { uniqueId } from 'lodash';
import { LayoutType } from '../../layout-types';

function component(layout: LayoutType) {
    if (!layout.key) {
        layout.key = uniqueId(layout.type);
    }
    return layout;
}

export default component;
