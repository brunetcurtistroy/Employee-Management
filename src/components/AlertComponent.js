import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { Component, useImperativeHandle, useState } from 'react';

let dimissedTimer
const AlertComponent = React.forwardRef((prop, ref) => {

    const [isShowAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState(0);
    const [alertText, setAlertText] = useState();
    const [alertTitle, setAlertTitle] = useState();
    const [isArray, setIsArray] = useState(false)

    const alertTypeList = [
        'info',
        'success',
        'warning',
        'error',

    ]

    useImperativeHandle(ref, () => ({
        showAlert: (num, title, text, _isArray = false) => {
            clearTimeout(dimissedTimer)

            setIsArray(_isArray)
            setTimeout(() => {
                setAlertType(num)
                setAlertText(text)
                setAlertTitle(title)

                setShowAlert(true)

                dimissedTimer = setTimeout(() => {
                    setShowAlert(false)
                }, 10000);
            }, 100);


        }
    }))

    return (
        <div style={{
            position: "fixed", top: '10px', right: '10px', zIndex: 2000
        }} >
            {isShowAlert &&
                <Stack>
                    <Alert severity={alertTypeList[alertType]} onClose={() => {
                        setShowAlert(false)
                    }}>
                        <AlertTitle>{alertTitle}</AlertTitle>
                        {isArray ?
                            alertText.map(t =>
                                <div>
                                    {t}
                                </div>)
                            : alertText}
                    </Alert>
                </Stack>}
        </div >
    )
})

export default AlertComponent