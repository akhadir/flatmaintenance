import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutType } from '../layout-types';
import validation from './operators/validation';

function iterateLayout(layout: LayoutType, callback: (childe: LayoutType) => void) {
    callback(layout);
    if (layout.children) {
        layout.children.forEach((child) => iterateLayout(child, callback));
    }
}
function eventManager(layout: LayoutType, callback: () => void) {
    const observable = new Observable<any>((subscriber) => {
        iterateLayout(
            layout,
            (child: any) => {
                subscriber.next(child);
            },
        );
        subscriber.complete();
    }).pipe(
        map((value: any) => validation(value)),
    );
    const observer = {
        next: (value: any) => {
            // console.log('Observer got a value:', value);
        },
        error: (err: any) => {
            console.log('Observer got an error:', err);
        },
        complete: () => {
            console.log('Event manager got complete notification');
            callback();
        },
    };
    observable.subscribe(observer);
}

export default eventManager;
