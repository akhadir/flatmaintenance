import React, { useCallback } from 'react';
import getData from '../../services/ocr';

function ImageParser() {
    const handleChangeFile = useCallback((event) => {
        console.log(event);
        getData(event.target.files.item(0));
    }, []);
    return (
        <input
            type="file"
            name="file"
            accept=".jpeg,.jpg,.png,.gif,.pdf"
            onChange={handleChangeFile}
            multiple
        />
    );
}

export default ImageParser;
