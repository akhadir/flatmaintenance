import { FunctionComponent } from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import component from './operators/component';
import { LayoutType } from '../layout-types';
import page from './operators/page';

export type ComponentMap = {
    [key: string]: {
        comp: FunctionComponent | undefined;
        props: any;
    };
};

function iterateLayout(layout: LayoutType, callback: (childe: LayoutType) => void) {
    callback(layout);
    if (layout.children) {
        layout.children.forEach((child) => iterateLayout(child, callback));
    }
}
function componentManager(layout: LayoutType, callback: (componentMap: ComponentMap) => void) {
    const compMap: ComponentMap = {};
    const observable = new Observable<any>((subscriber) => {
        iterateLayout(
            layout,
            (child: any) => {
                subscriber.next(child);
            },
        );
        subscriber.complete();
    }).pipe(
        map((value: any) => component(value, compMap)),
        map((value: any) => page(value, compMap)),
    );
    const observer = {
        next: (value: any) => {
            // console.log('Observer got a value:', value);
        },
        error: (err: any) => {
            console.log('Observer got an error:', err);
        },
        complete: () => {
            console.log('Component manager got complete notification', compMap);
            callback(compMap);
        },
    };
    observable.subscribe(observer);
}

export default componentManager;
