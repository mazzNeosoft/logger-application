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
import { Button, IconButton, InputAdornment, Box } from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';
import CustomInputField from '../components/CustomInputField';
import SelectField from '../components/SelectField';


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
  const [isApiLoading, setIsApiLoading] = useState(false);

  let { logId, applicationId, applicationType, actionType, from, to } = formData;

  const removeQueryParam = (param) => {
    const params = new URLSearchParams(query);
    params.delete(param);
    router.replace(
      { pathname, query: params.toString() },
      undefined,
      { shallow: true }
    );
    filterData(`${param}_check`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const init = async () => {
    try {
      setIsApiLoading(true);
      const apiURL = 'https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f';
      let response = await fetch(apiURL);
      let commits = await response.json();
      setIsApiLoading(false);
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
      setIsApiLoading(false);
    }
  };

  const handleFilter = () => {
    let newQ = {
    }
    if (logId) {
      newQ = { ...newQ, logId };
    }
    if (applicationId) {
      newQ = { ...newQ, applicationId };
    }
    if (applicationType) {
      newQ = { ...newQ, applicationType };
    }
    if (actionType) {
      newQ = { ...newQ, actionType };
    }
    if (from) {
      newQ = { ...newQ, from };
    }
    if (to) {
      newQ = { ...newQ, to };
    }
    router.replace({
      pathname: '/',
      query: newQ,
    })
    setPage(0);
    filterData();
  }

  const matchLogic = (rowData, queryData, keyName, params) => {
    return (rowData ?
      (params === `${keyName}_check`)
        ? rowData
        : queryData
          ? (rowData?.toString()).includes(queryData?.toString())
          : rowData
      : params === `${keyName}_check`
        ? "null"
        : queryData ? rowData : "null")
  }

  const filterData = (params = "", updatedParams) => {
    if (updatedParams) {
      logId = updatedParams?.logId;
      applicationId = updatedParams?.applicationId;
      applicationType = updatedParams?.applicationType;
      actionType = updatedParams?.actionType;
      from = updatedParams?.from;
      to = updatedParams?.to;
    }
    const filteredData = tableData?.filter(i => (
      matchLogic(i?.logId, logId, 'logId', params)
      && matchLogic(i?.applicationId, applicationId, 'applicationId', params)
      && matchLogic(i?.applicationType, applicationType, 'applicationType', params)
      && matchLogic(i?.actionType, actionType, 'actionType', params)
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
      // router.push({
      //   pathname: '/',
      //   query: { ...router.query, [fields]: dayjs(event).format("YYYY-MM-DD") },
      // })
    } else {
      name = event?.target?.name;
      value = event?.target?.value;
      // console.log(name, value);
      setFormData({ ...formData, [name]: value })
      // router.replace({
      //   pathname: '/',
      //   query: { ...router.query, [name]: value },
      // })
    }
  };
  const sortData = (order, orderBy) => (
    (a, b) => {
      if (a[orderBy] === b[orderBy]) return 0;
      if (a[orderBy] === null) return 1;
      if (b[orderBy] === null) return -1;
      if (order === 'asc') return a[orderBy] < b[orderBy] ? -1 : 1;
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  );
  const handleSort = (property) => {
    setPage(0)
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
    let obj = {
      logId: query?.logId || "",
      applicationId: query?.applicationId || "",
      applicationType: query?.applicationType || "",
      actionType: query?.actionType || "",
      from: query?.from || null,
      to: query?.to || null
    };
    router.beforePopState((res) => {
      const url = res?.as.startsWith('/') ? res?.as.slice(1) : res?.as;
      const params = new URLSearchParams(url);
      obj = {
        logId: params.get('logId') || "",
        applicationId: params.get('applicationId') || "",
        applicationType: params.get('applicationType') || "",
        actionType: params.get('actionType') || "",
        from: params.get('from') || null,
        to: params.get('to') || null
      }
      filterData("", obj);
    });
    setFormData(obj);
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
            <CustomInputField
              textLabel="Log ID"
              name="logId"
              value={formData?.logId}
              formData={formData}
              setFormData={setFormData}
              removeQueryParam={removeQueryParam}
              handleFields={handleFields}
            />

            <CustomInputField
              textLabel="Application ID"
              name="applicationId"
              value={formData?.applicationId}
              formData={formData}
              setFormData={setFormData}
              removeQueryParam={removeQueryParam}
              handleFields={handleFields}
            />

            <SelectField
              textLable="Application Type"
              name="applicationType"
              value={applicationType || ""}
              handleFields={handleFields}
              formData={formData}
              setFormData={setFormData}
              removeQueryParam={removeQueryParam}
              dataArr={appTypes}
            />
            <SelectField
              textLable="Action Type"
              name="actionType"
              value={actionType || ""}
              handleFields={handleFields}
              formData={formData}
              setFormData={setFormData}
              removeQueryParam={removeQueryParam}
              dataArr={actionTypes}
            />

            <Datepicker
              name="from"
              value={from}
              handleFields={handleFields}
              removeQueryParam={removeQueryParam}
              setFormData={setFormData}
              formData={formData}
              filterData={filterData}
            />

            <Datepicker
              filterData={filterData}
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
          {
            isApiLoading ? <Box sx={{ display: 'flex', 'justifyContent': 'center', 'padding': '80px' }}>
              <CircularProgress color="success" />
            </Box> :
              <>
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
                              <TableCell>{dayjs(item.creationTimestamp).format("YYYY-MM-DD") || '-'}</TableCell>
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
              </>
          }
        </Paper>
      </ThemeProvider>
    </div>
  )
}
export default Home
