import { IconButton } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './cash-trans.css';
import { getDatafromDataURI } from '../../services/ocr';

function dataURItoBlob(dataURI: string) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
}
function CashTransactions() {
    const camera = useRef();
    const [image, setImage] = useState<string>();
    const [fullscreen, setFullscreen] = useState(true);
    const errorMessages = {};
    const takePhoto = useCallback(() => {
        const cameraRef: { takePhoto?: Function } = camera.current || {};
        if (!image && cameraRef && cameraRef.takePhoto) {
            setImage(cameraRef.takePhoto());
            setFullscreen(false);
        } else {
            setImage(undefined);
        }
    }, [camera, image]);
    const toggleFullScreen = useCallback(() => {
        setFullscreen((status) => !status);
    }, []);
    const parentClassName = fullscreen ? 'cash-trans block-page' : 'cash-trans';
    const [imageData, setImageData] = useState();
    useEffect(() => {
        if (image) {
            getDatafromDataURI(image).then((response: any) => {
                setImageData(response.data);
            });
        }
    }, [image]);
    return (
        <div className={parentClassName}>
            <div>Handle Cash Transactions</div>
            <pre>{JSON.stringify(imageData, undefined, 4)}</pre>
            {!image && (
                <IconButton
                    className="close-camera"
                    aria-label="Take Photo"
                    onClick={toggleFullScreen}
                >
                    {fullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </IconButton>
            )}
            {!image && <Camera ref={camera} facingMode="environment" errorMessages={errorMessages} />}
            <IconButton
                className="camera-click"
                aria-label="Take Photo"
                onClick={takePhoto}
            >
                <img src="/images/circular-camera.png" alt="Take Pic" />
            </IconButton>
            {/* {image && <img className="captured-image" src={image} alt="Uploaded Bill" />} */}
        </div>
    );
}

export default CashTransactions;
