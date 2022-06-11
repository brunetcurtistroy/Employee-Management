import React, { useState, useRef, useEffect, useContext } from 'react'
import emploeyDataService from "../../services/employeeService"
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';

import { Paper, makeStyles, TableBody, TableRow, TableCell, IconButton, } from '@material-ui/core';
import { Box, Button, } from "@material-ui/core";


import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';


import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCallback } from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import CreateDlg from '../../components/dialogs/CreateDlg'
import InfoDlg from '../../components/dialogs/InfoDlg'
import DeleteDlg from '../../components/dialogs/DeleteDlg'

import useTable from "../../components/useTable";
import { UserContext } from '../../App/App';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
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


const headCells = [
    { id: 'id', label: 'id' },
    { id: 'fullName', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'employeed date', label: 'Employeed Day' },
    { id: 'birth date', label: 'Birth Day' },
    { id: 'delete date', label: 'Deleted Day' },
    { id: 'control', label: '', disableSorting: true },
]



export default function Employees() {
    const baseContext = useContext(UserContext)


    const classes = useStyles();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [isDeletedShow, setDeletedShow] = useState(false)

    const infoDlgRef = useRef()
    const createDlgRef = useRef()
    const deleteDlgRef = useRef()


    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable( headCells, filterFn, isDeletedShow);

    useEffect(() => {
        baseContext.setLoading(true)
        emploeyDataService.getEmployees({ page: 1, limit: 5 })
            .then((response) => {
                baseContext.setBaseData(response.data.employees)
                baseContext.setPageCount(response.data.count)
            })
            .catch((e) => {
                baseContext.handlerError(e)
            }).finally((e) => {
                baseContext.setLoading(false)
            });
    }, [])

    const createFunc = () => {
        createDlgRef.current.openDlg(true)
    }

    const editFunc = (item) => {
        createDlgRef.current.openDlg(false, item)
    }

    const viewDetailFunc = (item) => {
        infoDlgRef.current.openDlg(item)
    }

    const deleteFunc = (item) => {
        deleteDlgRef.current.openDlg({ item: item, isSoftDelete: !isDeletedShow })
    }

    const changeDisable = () => {
        setDeletedShow(!isDeletedShow)
        baseContext.setPage(0)
        baseContext.setLoading(true)
        if (isDeletedShow)
            emploeyDataService.getEmployees({ page: 1, limit: 5 })
                .then((response) => {
                    baseContext.setBaseData(response.data.employees)
                    baseContext.setPageCount(response.data.count)
                })
                .catch((e) => {
                    baseContext.handlerError(e)
                }).finally((e) => {
                    baseContext.setLoading(false)
                });
        else
            emploeyDataService.getDeletedEmployees({ page: 1, limit: 5 })
                .then((response) => {
                    baseContext.setBaseData(response.data.employees)
                    baseContext.setPageCount(response.data.count)
                })
                .catch((e) => {
                    baseContext.handlerError(e)
                }).finally((e) => {
                    baseContext.setLoading(false)
                });
    }


    return (
        <>
            <PageHeader
                title="Employees Management System"
                subTitle="Test assisnment"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>


                <Box
                    display="flex"
                    justifyContent={'space-between'}
                >

                    <Button variant="contained"
                        disabled={isDeletedShow}

                        color="primary" sx={{ height: 40 }} onClick={createFunc}>
                        Add New Data
                    </Button>

                    <FormGroup>
                        <FormControlLabel
                            onChange={changeDisable}
                            control={<Switch unChecked />} label="Deleted Items" />
                    </FormGroup>
                </Box>

                <div style={{ overflow: 'auto' }}>
                    <TblContainer  >
                        <TblHead />
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map((item, index) =>
                                (
                                    <TableRow key={item.id} >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phoneNumber}</TableCell>
                                        <TableCell>{item.dateOfEmployment}</TableCell>
                                        <TableCell>{item.dateOfBirth}</TableCell>
                                        {
                                            isDeletedShow &&
                                            <TableCell>{item.deletedAt}</TableCell>
                                        }

                                        <TableCell
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word"
                                            }}
                                            align="right">
                                            <Box
                                                display="flex"
                                                flexDirection={'row'}
                                                justifyContent={'space-around'}
                                            >
                                                {!isDeletedShow &&
                                                    <IconButton
                                                        onClick={() => viewDetailFunc(item)}
                                                        color="" aria-label="delete" size="small">
                                                        <VisibilityIcon fontSize="inherit" />
                                                    </IconButton>
                                                }

                                                {!isDeletedShow &&
                                                    <IconButton
                                                        onClick={() => editFunc(item)}
                                                        color="" aria-label="delete" size="small">
                                                        <EditIcon fontSize="inherit" />
                                                    </IconButton>
                                                }
                                                <IconButton
                                                    onClick={() => { deleteFunc(item) }}
                                                    color="" aria-label="remove" size="small">
                                                    {
                                                        !isDeletedShow ?
                                                            <DeleteIcon fontSize="inherit" />
                                                            :
                                                            <DeleteForeverIcon fontSize="inherit" />
                                                    }

                                                </IconButton>

                                            </Box>

                                        </TableCell>

                                    </TableRow>
                                )
                                )
                            }
                        </TableBody>
                    </TblContainer>
                    <TblPagination />

                    <InfoDlg ref={infoDlgRef} />
                    <CreateDlg ref={createDlgRef} />
                    <DeleteDlg ref={deleteDlgRef} />
                </div>
            </Paper>
        </>
    )
}
