import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { FormLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';


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

const initialValue = {
    "_id": "",
    "deletedAt": null,
    "isDeleted": false,
    "dateOfBirth": "2000-01-01",
    "dateOfEmployment": "2000-01-01",
    "homeAddress": {
        "addressLine2": "",
        "addressLine1": "",
        "ZIPCode": "",
        "city": "",
    },
    "phoneNumber": "",
    "email": "",
    "name": "",
}

const DraggableDialog = React.forwardRef((prop, ref) => {

    const dlgStyle = useStyles()

    const [open, setOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(initialValue)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useImperativeHandle(ref, () => ({
        openDlg: (item) => {
            setCurrentItem(item)
            handleClickOpen()
        }
    }))

    return (
        <div>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                >
                    Detail View
                </DialogTitle>
                <DialogContent>
                    <FormControl
                        sx={{
                            minWidth: 400,
                        }}>
                        <Grid container direction="column" spacing={1}>
                            <Grid container direction="column" item>
                                <FormLabel >Name</FormLabel>
                                <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                    {currentItem.name}
                                </Box>
                            </Grid>

                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Email</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.email}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Phone Number</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.phoneNumber}
                                    </Box>
                                </Grid>
                            </Grid>


                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Birth Day</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.dateOfBirth}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Employeed Day</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.dateOfEmployment}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Home Address</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.homeAddress.city}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container direction="column" item>
                                <Grid item justifyContent='flex-end'>
                                    <FormLabel >Zip Code</FormLabel>
                                </Grid>
                                <Grid alignItems >
                                    <Box component="div" sx={{ whiteSpace: 'normal' }}>
                                        {currentItem.homeAddress.ZIPCode}
                                    </Box>
                                </Grid>
                            </Grid>


                        </Grid>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
})

export default DraggableDialog