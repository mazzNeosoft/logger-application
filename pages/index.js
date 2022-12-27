import Head from 'next/head'
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import TablePagination from "@mui/material/TablePagination";
import { Button, IconButton, InputAdornment } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs from "dayjs";
import Datepicker from '../components/Datepicker';
import { TableHeader } from '../components/TableHeader';

const Home = () => {
  const lightTheme = createTheme({ palette: { mode: 'light' } });
  const [tableData, settableData] = useState([]);
  const [filteredData, setfilteredData] = useState([]);
  const router = useRouter()
  const { pathname, query } = router;
  const [formData, setFormData] = useState({});

  const [page, setPage] = useState(0);
  const ROWS_PER_PAGE = 10;
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("asc");

  const [appTypes, setappTypes] = useState([]);
  const [actionTypes, setactionTypes] = useState([]);

  const { logId, applicationID, applicationType, actionType, from, to } = formData;

  const removeQueryParam = (param) => {
    const params = new URLSearchParams(query);
    params.delete(param);
    router.replace(
      { pathname, query: params.toString() },
      undefined,
      { shallow: true }
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const init = async () => {
    try {
      const apiURL = 'https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f';
      let response = await fetch(apiURL);
      let commits = await response.json();
      let data = commits?.result?.auditLog;
      let appTypeDatas = [];
      let actiontypeDatas = [];
      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        if (e.applicationType) {
          appTypeDatas.push(e?.applicationType);
        }
        if (e.actionType) {
          actiontypeDatas.push(e?.actionType);
        }
      }
      setappTypes(appTypeDatas?.length ? [... new Set(appTypeDatas)] : []);
      setactionTypes(actiontypeDatas?.length ? [... new Set(actiontypeDatas)] : []);
      settableData(data);
    } catch (error) {

    }
  };

  const handleFilter = () => {
    setPage(0);
    filterData();
  }

  const filterData = () => {
    const filteredData = tableData?.filter(i => (
      i?.logId == (logId ? logId : i?.logId)
      && i?.applicationId == (applicationID ? applicationID : i?.applicationId)
      && i?.applicationType == (applicationType ? applicationType : i?.applicationType)
      && i?.actionType == (actionType ? actionType : i?.actionType)
      && (i?.creationTimestamp >= (from ? from : i?.creationTimestamp))
      && (i?.creationTimestamp <= (to ? to + 1 : i?.creationTimestamp))
    ));
    setfilteredData(filteredData);
  }

  const handleFields = (event, fields) => {
    let name = "";
    let value = "";
    if (fields) {
      setFormData({ ...formData, [fields]: dayjs(event).format("YYYY-MM-DD") })
      router.push({
        pathname: '/',
        query: { ...router.query, [fields]: dayjs(event).format("YYYY-MM-DD") },
      })
    } else {
      name = event?.target?.name;
      value = event?.target?.value;
      setFormData({ ...formData, [name]: value })
      router.push({
        pathname: '/',
        query: { ...router.query, [name]: value },
      })
    }
  };
  const sortData = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
      }
      : (a, b) => {
        if (b[orderBy] > a[orderBy]) return -1;
        if (b[orderBy] < a[orderBy]) return 1;
        return 0;
      };
  }
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const clearFilter = () => {
    setFormData({})
    router.replace('/', undefined, { shallow: true });
    setPage(0)
    setOrder("")
    setOrderBy("asc");
    setfilteredData(tableData);
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      logId: query?.logId || "",
      applicationID: query?.applicationID || "",
      applicationType: query?.applicationType || "",
      actionType: query?.actionType || "",
      from: query?.from || null,
      to: query?.to || null
    })
  }, [router])

  useEffect(() => {
    filterData();
  }, [tableData])

  return (
    <div className='section'>
      <Head>
        <title>Logger Application</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='header'>Logger Application</h1>

      <ThemeProvider theme={lightTheme}>
        <Paper elevation={3}>
          <div className="align">
            <TextField
              className='gap'
              name="logId"
              type="number"
              label="Log Id"
              value={logId || ""}
              variant="outlined"
              onChange={(e) => {
                handleFields(e);
              }}
              InputProps={
                formData?.logId && {
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setFormData({ ...formData, logId: "" });
                        removeQueryParam('logId');
                      }}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }
              }
            />

            <TextField
              className='gap'
              name="applicationID"
              type="text"
              label="Application ID"
              value={applicationID || ""}
              variant="outlined"
              onChange={(e) => {
                handleFields(e);
              }}
              InputProps={
                formData?.applicationID && {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                    >
                      <IconButton
                        onClick={() => {
                          setFormData({ ...formData, applicationID: "" });
                          removeQueryParam('applicationID');
                        }}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }
            />

            <FormControl className='gap' fullWidth>
              <InputLabel id="demo-simple-select-label">Application Type</InputLabel>
              <Select
                name="applicationType"
                value={applicationType || ""}
                label="Application Type"
                onChange={(e) => {
                  handleFields(e);
                }}
                endAdornment={
                  applicationType && (
                    <InputAdornment
                      position="end"
                      classes="iconButton"
                    >
                      <IconButton
                        classes="iconButton"
                        onClick={() => {
                          setFormData({ ...formData, applicationType: "" });
                          removeQueryParam('applicationType');
                        }}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              >
                <MenuItem value="" disabled>Please select</MenuItem>
                {
                  appTypes?.map((i) => (
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <FormControl className='gap' fullWidth>
              <InputLabel id="demo-simple-select-label">Action Type</InputLabel>
              <Select
                name="actionType"
                value={actionType || ""}
                label="Action Type"
                onChange={(e) => {
                  handleFields(e);
                }}
                endAdornment={
                  actionType && (
                    <InputAdornment
                      position="end"
                      classes="iconButton"
                    >
                      <IconButton
                        classes="iconButton"
                        onClick={() => {
                          setFormData({ ...formData, actionType: "" });
                          removeQueryParam('actionType');
                        }}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              >
                <MenuItem value="" disabled>Please select</MenuItem>
                {
                  actionTypes?.map((i) => (
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <Datepicker
              name="from"
              value={from}
              handleFields={handleFields}
              removeQueryParam={removeQueryParam}
              setFormData={setFormData}
              formData={formData}
            />

            <Datepicker
              removeQueryParam={removeQueryParam}
              name="to"
              value={to}
              handleFields={handleFields}
              setFormData={setFormData}
              formData={formData}
            />
            <Button role="button" name="search" onClick={handleFilter} variant="outlined" size="large">Search</Button>
            <Button role="button" name="clear" onClick={clearFilter} size="large">Clear All</Button>
          </div>
        </Paper>

        <Paper className='tableSection' elevation={3}>
          <TableContainer>
            <Table size="small">
              <TableHeader
                order={order}
                orderBy={orderBy}
                sortHandler={handleSort}
              />
              <TableBody>
                {
                  filteredData
                    .sort(sortData(order, orderBy))
                    .slice(
                      page * ROWS_PER_PAGE,
                      page * ROWS_PER_PAGE + ROWS_PER_PAGE
                    )
                    .map((item, i) => (
                      <TableRow key={i}>
                        <TableCell> {item.logId || '-'}</TableCell>
                        <TableCell> {item.applicationId || '-'}</TableCell>
                        <TableCell> {item.applicationType || '-'}</TableCell>
                        <TableCell> {item.actionType || '-'} </TableCell>
                        <TableCell>{item.creationTimestamp || '-'}</TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredData?.length}
            page={page}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[10]}
            onPageChange={handleChangePage}
          />
        </Paper>
      </ThemeProvider>
    </div>
  )
}
export default Home
