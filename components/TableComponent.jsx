import React from 'react'
import { TableContainer, Table, TableBody, TableRow, TableCell, TablePagination } from '@mui/material';
import { TableHeader } from './TableHeader';

const TableComponent = ({ order, orderBy, handleSort, filteredData, page, rowsPerPage, handleChangePage, sortData }) => {
  return (
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
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
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
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        onPageChange={handleChangePage}
      />
    </>
  )
}

export default TableComponent
