import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Field, Form, Formik } from 'formik';
import { makeStyles } from '@material-ui/core';
import {
    Box,
    Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel,
    FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Typography
} from '@material-ui/core';
import EmployeeService from '../../services/employeeService';

import { UserContext } from '../../App/App';
const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(1),
        padding: theme.spacing(0)
    },

    titleItemRight: {
        color: "white",
        backgroundColor: "blue",
        top: "50%",
        height: 30,
        float: "right",
        position: "relative",

    }
}))

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}



const DraggableDialog = React.forwardRef((prop, ref) => {
    const initialValue = {
        "dateOfBirth": "2000-01-01",
        "dateOfEmployment": "2000-01-01",
        "homeAddress": {
            "addressLine2": " ",
            "addressLine1": " ",
            "ZIPCode": "",
            "city": "",
        },
        "phoneNumber": "",
        "email": "",
        "name": "",
    }

    const baseContext = React.useContext(UserContext)
    const dlgStyle = useStyles()

    const [open, setOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(initialValue)
    const [isCreate, setIsCreate] = React.useState(true)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentItem(initialValue)
    };

    const saveFunc = (values, actions) => {
        actions.setSubmitting(true);


        let homeAddress = {}
        console.log('values', values)

        if (values.city)
            homeAddress.city = values.city
        if (values.zipcode)
            homeAddress.ZIPCode = String(values.zipcode)

        let item = {}

        if (homeAddress != {}) {
            homeAddress.addressLine2 = " "
            homeAddress.addressLine1 = " "
            if (!homeAddress.ZIPCode)
                homeAddress.ZIPCode = currentItem.homeAddress.ZIPCode;
            if (!homeAddress.city)
                homeAddress.city = currentItem.homeAddress.city;
            item.homeAddress = homeAddress
        }


        if (values._name)
            item.name = values._name
        if (values._phone)
            item.phoneNumber = values._phone
        if (values._email)
            item.email = values._email
        if (values._birth)
            item.dateOfBirth = values._birth
        if (values._employed)
            item.dateOfEmployment = values._employed

        if (!String(item.phoneNumber).includes('+') && item.phoneNumber)
            item.phoneNumber = "+" + String(item.phoneNumber)


        baseContext.setLoading(true)
        console.log(item)

        if (isCreate) {

            EmployeeService.create(item)
                .then((response) => {
                    const baseData = baseContext.baseData
                    
                    baseContext.setPageCount(baseContext.pageCount + 1)
                    if (baseData.length == baseContext.rowsPerPage)
                        baseContext.setPage(baseContext.page + 1)

                    baseData.push(response.data)
                    baseContext.setBaseData(baseData)

                    baseContext.showAlert(1, 'Awsome', 'Created new data')
                    handleClose()
                })
                .catch((e) => {
                    baseContext.handlerError(e)

                }).finally((e) => {
                    baseContext.setLoading(false)
                });

        }
        else {
            EmployeeService.update(currentItem._id, item).then((response) => {
                const baseData = baseContext.baseData;
                baseData.map((data, index) => {
                    if (data.id == currentItem._id)
                        baseData[index] = response.data;

                })
                baseContext.setBaseData(baseData)
                baseContext.showAlert(1, 'Great', ' Data is updated')
                handleClose()
            })
                .catch((e) => {
                    baseContext.handlerError(e)

                }).finally((e) => {
                    baseContext.setLoading(false)
                });
        }
    }



    React.useImperativeHandle(ref, () => ({
        openDlg: (isCreate, item = null) => {
            setIsCreate(isCreate)
            if (item) {
                item.phoneNumber = item.phoneNumber.slice(1)
                setCurrentItem(item)
            }
            else
                setCurrentItem(initialValue)

            handleClickOpen()
        }
    }))


    return (
        <div>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            // onBackdropClick="false"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {isCreate ? 'Add New Data' : 'Edit Data'}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{}}
                        onSubmit={saveFunc}
                    >
                        {({ handleSubmit }) => (
                            <Form className={dlgStyle.pageContent}>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item container justify="space-between" spacing={2} alignItems="center">

                                        <Grid item >
                                            <Field

                                                defaultValue={currentItem.name}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                name="_name"
                                                placeholder='Jake Bond'

                                                label="Full Name" as={TextField} variant="outlined" fullWidth></Field>
                                        </Grid>
                                        <Grid item>
                                            <Field
                                                InputLabelProps={{ shrink: true }}
                                                name="_phone"
                                                defaultValue={currentItem.phoneNumber}
                                                required
                                                label="PhoneNumber"
                                                placeholder='12098132684'

                                                as={TextField} type={'number'} variant="outlined" >

                                            </Field>
                                        </Grid>
                                    </Grid>

                                    <Grid item container justify="space-between" spacing={2} alignItems="center">
                                        <Grid item >
                                            <Field
                                                InputLabelProps={{ shrink: true }}
                                                defaultValue={currentItem.email}
                                                required
                                                placeholder='align@gmail.com'

                                                name="_email" label="Email Adress" as={TextField} variant="outlined" fullWidth></Field>
                                        </Grid>

                                        <Grid item >
                                            <Field
                                                InputLabelProps={{ shrink: true }}
                                                defaultValue={currentItem.dateOfBirth}
                                                required

                                                name="_birth" label="Birth Date" as={TextField} variant="outlined" type="date" fullWidth ></Field>
                                        </Grid>
                                    </Grid>

                                    <Grid item container justify="space-between" spacing={2} alignItems="center">
                                        <Grid item xs>
                                            <Field
                                                InputLabelProps={{ shrink: true }}
                                                defaultValue={currentItem.homeAddress.city}
                                                required
                                                placeholder='169 Route Lucie St-Gabrielle-de-Buckland, AB'
                                                name="city" label="Home Adress" as={TextField} variant="outlined" fullWidth></Field>

                                        </Grid>
                                    </Grid>

                                    <Grid item container justify="space-between" spacing={2} alignItems="center">
                                        <Grid item >
                                            <Field
                                                InputLabelProps={{ shrink: true }}
                                                defaultValue={currentItem.homeAddress.ZIPCode}
                                                required
                                                placeholder='542315'
                                                name="zipcode" label="Zip Code" as={TextField} variant="outlined" type={'number'} fullWidth></Field>
                                        </Grid>
                                        <Grid item >
                                            <Field
                                                defaultValue={currentItem.dateOfEmployment}
                                                required
                                                name="_employed" label="Employeed Date" as={TextField} variant="outlined" type="date" fullWidth InputLabelProps={{ shrink: true }}></Field>
                                        </Grid>
                                    </Grid>

                                    <Box
                                        display={'flex'}
                                        justifyContent={'end'}
                                        className={dlgStyle.pageContent}
                                    >
                                        <Button variant="contained" color="primary" size="miduem" type="submit">{isCreate ? 'Create' : 'Edit'}</Button>

                                    </Box>

                                </Grid>

                            </Form>
                        )
                        }
                    </Formik >
                </DialogContent>

            </Dialog>


        </div>
    );
})

export default DraggableDialog