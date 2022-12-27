import { TableHead, TableSortLabel } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const tableHeader = [
  {
    id: "logId",
    label: "Log Id",
  },
  {
    id: "applicationId",
    label: "Application Id",
  },
  {
    id: "applicationType",
    label: "Application Type",
  },
  {
    id: "actionType",
    label: "Action Details",
  },
  {
    id: "creationTimestamp",
    label: "Date : Time",
  },
];

export function TableHeader(props) {
  const { order, orderBy, sortHandler } = props;

  const sortData = (property) => () => {
    sortHandler(property);
  };

  return (
    <TableHead>
      <TableRow>
        {tableHeader.map((i) => (
          <TableCell
            key={i.id}
            sortDirection={orderBy === i.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === i.id}
              direction={orderBy === i.id ? order : "asc"}
              onClick={sortData(i.id)}
            >
              {i.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
