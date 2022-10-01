import { empty, of } from 'rxjs';
import { LayoutType } from '../../layout-types';

function field(layout: LayoutType) {
    if (layout.type === 'field') {
        layout.children = [{
            name: layout.name,
            type: layout.showAs || 'input',
            id: 'field',
            config: layout.config,
        }];
        return of(layout.children);
    }
    return empty();
}

export default field;
