import React, { useState } from 'react';
import './App.css';
import SideMenu from "../components/SideMenu";
import { makeStyles, CssBaseline, createTheme, ThemeProvider, } from '@material-ui/core';
import Employees from "../pages/Employees/Employees";
import AlertComponent from '../components/AlertComponent';
import CircularProgress from '@mui/material/CircularProgress';

import { createContext } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f4f5fd"
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
})



const useStyles = makeStyles({
  appMain: {
    // paddingLeft: '320px',
    width: '100%'
  }
})


export const UserContext = createContext();


function App() {

  const classes = useStyles();
  const alertRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [baseData, setBaseData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const changeBaseData = (prop) => {
    setBaseData(prop)
  }

  const showAlert = (num, title, text, isArray = false) => {
    alertRef.current.showAlert(num, title, text, isArray)
  }

  const setLoading = (prop) => {
    setIsLoading(prop)
  }

  const handlerError = (e) => {

    console.log(e)
    if (e.response)
      switch (e.response.status) {
        case 500:
          showAlert(2, 'server error', 'not connected to server. try again.')
          break;
        case 400:
          let errorData = e.response.data.message;
          showAlert(3, 'Error', errorData, true)
          break;
        default:
          showAlert(2, 'Error', 'Chendk your connection and try again')
          break;
      }
    else
      showAlert(2, 'Sorry', 'your control is failed . try again please. ')
  }

  const changePageCount = (prop) => {
    setPageCount(prop)
  }


  const getGlobalStates = () => {
    return {
      baseData: baseData,
      setBaseData: changeBaseData,
      showAlert: showAlert,
      setLoading: setLoading,
      handlerError: handlerError,
      pageCount: pageCount,
      setPageCount: changePageCount,
      page: page,
      setPage: setPage,
      setRowsPerPage: setRowsPerPage,
      rowsPerPage: rowsPerPage
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SideMenu />

      <UserContext.Provider
        value={getGlobalStates()} >
        <div className={classes.appMain}>
          <Employees />
          <AlertComponent ref={alertRef} />

          {isLoading &&
            <div style={{
              position: "fixed", top: '30px', right: '60px', zIndex: 3000
            }} >
              <CircularProgress />
            </div>
          }
        </div>
      </UserContext.Provider>

      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
