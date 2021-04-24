import React from 'react';
import { BankTransaction } from '../online-transactions/file-parser-util';
import TransPreview from './trans-preview';
import './index.css';
import { CatView } from './cat-view';

export type MappingProps = {
    xlsData: BankTransaction[];
}
export const Mapping = (props: MappingProps) => {
    console.log(props);
    return (
        <>
            <p>Map transactions to the corresponding category.</p>
            <div className="mapping-wrapper">
                <TransPreview xlsData={props.xlsData} />
                <CatView />
            </div>
        </>
    );
};

export default Mapping;
