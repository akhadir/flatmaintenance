import { BillEvent } from '../../../../services/redux/bills/bills-types';
import { runLayout } from '../../layout-manager';

function validation(event: BillEvent) {
    if (event.type === 'wizard:next') {
        event.layout.config.activeStep += 1;
        runLayout(event.layout);
    }
}

export default validation;
