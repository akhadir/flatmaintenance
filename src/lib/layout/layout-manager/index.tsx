import { Observable } from 'rxjs';
import { expand, map } from 'rxjs/operators';
import component from './operators/component';
import { LayoutType } from '../layout-types';
import wizard from './operators/wizard';
import field from './operators/field';
import billComp from './operators/bill-config';

function iterateLayout(layout: LayoutType, callback: (childe: LayoutType) => void) {
    callback(layout);
    if (layout.children) {
        layout.children.forEach((child) => {
            child.parent = layout;
            iterateLayout(child, callback);
        });
    }
}
function layoutManager(layout: LayoutType, callback: (layout: LayoutType) => void) {
    const observable = new Observable<any>((subscriber) => {
        iterateLayout(
            layout,
            (child: any) => {
                subscriber.next(child);
            },
        );
        subscriber.complete();
    }).pipe(
        map((value: any) => component(value)),
        expand((value: any) => field(value)),
        map((value: any) => billComp(value)),
        map((value: any) => wizard(value)),
    );
    const observer = {
        next: (value: any) => {
            // console.log('Observer got a value:', value);
        },
        error: (err: any) => {
            console.log('Observer got an error:', err);
        },
        complete: () => {
            console.log('Layout manager got complete notification', layout);
            let output = layout;
            while (output.parent) {
                output = output.parent;
            }
            callback(output);
        },
    };
    observable.subscribe(observer);
}

let callback: (layout: LayoutType) => void;
export const runLayout = (layout: LayoutType, cb?: (layout: LayoutType) => void) => {
    if (cb) {
        callback = cb;
    }
    layoutManager(layout, callback);
};

export default layoutManager;
