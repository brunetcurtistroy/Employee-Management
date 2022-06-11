import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { UserContext } from '../../App/App';

import EmployeeService from '../../services/employeeService';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialogSlide = React.forwardRef((prop, ref) => {
    {
        const [open, setOpen] = React.useState(false);
        const [currentItem, setCurrentItem] = React.useState({})
        const [isSoftDelete, setIsSoftDelete] = React.useState(true)
        const baseContext = React.useContext(UserContext)

        React.useImperativeHandle(ref, () => ({
            openDlg: (prop) => {
                setCurrentItem(prop.item)
                setIsSoftDelete(prop.isSoftDelete)
                setOpen(true);
            }
        }))
        const deleteData = () => {
            baseContext.setLoading(true)
            if (isSoftDelete)
                EmployeeService.softRemove(currentItem._id).then((response) => {
                    const newData = baseContext.baseData;
                    if (newData.length == 1 && baseContext.page > 0)
                        baseContext.setPage(baseContext.page - 1)

                    newData.map((data, index) => {
                        if (data._id == currentItem._id)
                            newData[index] = response.data;
                    })

                    baseContext.setBaseData(newData)
                    baseContext.setPageCount(baseContext.pageCount - 1)

                    baseContext.showAlert(0, 'Good', ' Data is deleted softly')
                })
                    .catch((e) => {
                        baseContext.handlerError(e)
                    }).finally((e) => {
                        baseContext.setLoading(false)
                    });
            else
                EmployeeService.foreverRemove(currentItem._id)
                    .then((response) => {
                        const newData = baseContext.baseData;
                        if (newData.length == 1 && baseContext.page > 0)
                            baseContext.setPage(baseContext.page - 1)

                        newData.map((data, index) => {
                            if (data._id == currentItem._id)
                                newData.splice(index, 1)
                        })

                        baseContext.setBaseData(newData)
                        baseContext.setPageCount(baseContext.pageCount - 1)
                        baseContext.showAlert(1, 'Remember', ' Data is deleted forever')
                    })
                    .catch((e) => {
                        baseContext.handlerError(e)
                    }).finally((e) => {
                        baseContext.setLoading(false)
                    });
        };

        const handleClose = () => {
            deleteData()
            setOpen(false);

        };

        return (
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Delete Data"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {isSoftDelete ? 'Are you agree to  delete softly ?' : 'Are you agree to  delete forever? '}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Agree</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

})

export default AlertDialogSlide;