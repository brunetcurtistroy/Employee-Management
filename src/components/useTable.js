import React, { useContext, useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination, TableSortLabel } from '@material-ui/core'
import emploeyDataService from "../services/employeeService"
import { UserContext } from '../App/App';


const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
    },
}))

export default function useTable(headCells, filterFn, isDeletedShow) {

    const classes = useStyles();
    const baseContext = useContext(UserContext)

    const pages = [5, 10, 25]


    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const records = baseContext.baseData
    const TblContainer = props => (
        <Table className={classes.table}>
            {props.children}
        </Table>
    )

    const hideColumnNum = isDeletedShow ? [] : [6]
    const TblHead = props => {

        const handleSortRequest = cellId => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(cellId)
        }

        return (<TableHead>
            <TableRow>
                {
                    headCells.map((headCell, index) => (
                        !hideColumnNum.includes(index) &&
                        <TableCell align={index != headCells.length - 1 ? "left" : "center"} key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}>
                            {headCell.disableSorting ? headCell.label :
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => { handleSortRequest(headCell.id) }}>
                                    {headCell.label}
                                </TableSortLabel>
                            }
                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }

    const handleChangePage = (event, newPage) => {
        baseContext.setPage(newPage);
        loadPageData(newPage, baseContext.rowsPerPage)
    }

    const handleChangeRowsPerPage = event => {
        let perPage = parseInt(event.target.value, 10)
        baseContext.setRowsPerPage(perPage)
        baseContext.setPage(0);
        loadPageData(baseContext.page, perPage)
    }

    const loadPageData = (page, perPage) => {
        if (!isDeletedShow)
            emploeyDataService.getEmployees({ page: page + 1, limit: perPage })
                .then((response) => {

                    baseContext.setBaseData(response.data.employees)

                })
                .catch((e) => {
                    baseContext.handlerError(e)
                }).finally((e) => {
                    baseContext.setLoading(false)
                });
        else
            emploeyDataService.getDeletedEmployees({ page: page + 1, limit: perPage })
                .then((response) => {
                    baseContext.setBaseData(response.data.employees)
                })
                .catch((e) => {
                    baseContext.handlerError(e)
                }).finally((e) => {
                    baseContext.setLoading(false)
                });

    }
    const TblPagination = () => (<TablePagination
        component="div"
        page={baseContext.page}
        rowsPerPageOptions={pages}
        rowsPerPage={baseContext.rowsPerPage}
        count={baseContext.pageCount}

        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
    />)

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        const data = stableSort(filterFn.fn(records), getComparator(order, orderBy)).filter(item => item.isDeleted == isDeletedShow)
        return data;
    }

    return {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}
