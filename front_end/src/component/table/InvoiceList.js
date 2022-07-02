import React, { useState, useEffect } from "react";
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";

import getDataObject from "../crudOperations/dataObjectTemplate";

function InvoiceList({
    rows,
    selectedRows,
    setSelectedRows,
    numSelectedRows,
    setNumSelectedRows,
    activeSortColumn,
    setActiveSortColumn,
    sortDirection,
    setSortDirection,
}) {
    // columns to show
    const column_name = getDataObject();

    // handles click on row ( only tableBody )
    const handleClick = (id, index) => {
        if (selectedRows[`sl_no_${id}`]) {
            delete selectedRows[`sl_no_${id}`];
            setNumSelectedRows(numSelectedRows <= 1 ? 0 : numSelectedRows - 1);
        } else {
            selectedRows[`sl_no_${id}`] = rows[index];
            setNumSelectedRows(numSelectedRows + 1);
        }
    };

    // handles (select-deselect All) checkbox clicks
    const handleCheckboxClick = () => {
        if (numSelectedRows > 0) {
            setSelectedRows({});
            setNumSelectedRows(0);
        } else {
            rows.forEach(
                (item) => (selectedRows[`sl_no_${item.sl_no}`] = item)
            );
            setNumSelectedRows(rows.length);
        }
    };

    return (
        <>
            <TableContainer sx={{ maxHeight: "480px" }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                padding="checkbox"
                                sx={{
                                    backgroundColor: (theme) =>
                                        theme.palette.background.paper,
                                }}
                            >
                                <Checkbox
                                    indeterminate={
                                        numSelectedRows > 0 &&
                                        numSelectedRows < rows.length
                                    }
                                    checked={
                                        numSelectedRows > 0 &&
                                        numSelectedRows === rows.length
                                    }
                                    onClick={handleCheckboxClick}
                                    size="small"
                                ></Checkbox>
                            </TableCell>
                            {column_name.map((column, index) => {
                                if (column.show)
                                    return (
                                        <TableCell
                                            align="right"
                                            key={column.key}
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.background
                                                        .paper,
                                            }}
                                        >
                                            <TableSortLabel
                                                onClick={() => {
                                                    activeSortColumn ===
                                                    column.key
                                                        ? setSortDirection(
                                                              `${
                                                                  sortDirection ===
                                                                  "asc"
                                                                      ? "desc"
                                                                      : "asc"
                                                              }`
                                                          )
                                                        : setActiveSortColumn(
                                                              column.key
                                                          );
                                                }}
                                                active={
                                                    column.key ===
                                                    activeSortColumn
                                                }
                                                direction={sortDirection}
                                            >
                                                {column.name}
                                            </TableSortLabel>
                                        </TableCell>
                                    );

                                return null;
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 
                            Table Body
                        */}
                        {rows.map((row, index) => {
                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    role="checkbox"
                                    onClick={() => {
                                        handleClick(row["sl_no"], index);
                                    }}
                                >
                                    <TableCell
                                        role={"checkbox"}
                                        padding="checkbox"
                                    >
                                        <Checkbox
                                            checked={
                                                selectedRows[
                                                    `sl_no_${row.sl_no}`
                                                ]
                                                    ? true
                                                    : false
                                            }
                                            size="small"
                                        ></Checkbox>
                                    </TableCell>
                                    {column_name.map((column) => {
                                        let key = column.key;
                                        if (column.show)
                                            return (
                                                <TableCell
                                                    align="right"
                                                    variant="body"
                                                    key={key}
                                                >
                                                    <Typography
                                                        noWrap
                                                        variant={"body2"}
                                                    >
                                                        {row[key]}
                                                    </Typography>
                                                </TableCell>
                                            );

                                        return null;
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default InvoiceList;
