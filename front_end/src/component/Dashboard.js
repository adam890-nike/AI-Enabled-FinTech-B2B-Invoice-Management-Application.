import React, { useEffect, useState } from "react";

import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  Snackbar,
  TablePagination,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";

import theme from "../style/theme";
import InvoiceList from "./table/InvoiceList";
import InvoiceOptions from "./options/InvoiceOptions";

import fetchData from "./crudOperations/fetchData";
import updateData from "./crudOperations/updateData";
import postData from "./crudOperations/postData";

import Add from "./options/Add";
import EditInvoice from "./options/Edit";
import DeleteInvoice from "./options/DeleteInvoice";
import deleteData from "./crudOperations/deleteData";
import Search from "./options/Search";
import AdvancedSearch from "./options/AdvanceSearch";
import AnalyticsView from "./options/AnalyticsView";
import BarChart from "./chart/BarChart";
import predictData from "./crudOperations/predictData";

function Dashboard() {
  const [rows, setRows] = useState([]); // data which need to be displayed
  const [selectedRows, setSelectedRows] = useState({}); // selected rows
  const [numSelectedRows, setNumSelectedRows] = useState(0);

  // for filtering
  const [filter, setFilter] = useState({});

  // to reload data
  const [reloadData, setReloadData] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("warning");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialog, setDialog] = useState("");

  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  //for sorting
  const [activeSortColumn, setActiveSortColumn] = useState("sl_no"); // column used for sorting
  const [sortDirection, setSortDirection] = useState("asc"); // direction used for sorting

  // for tablepagination
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0); // update from db

  // for analytics view
  const [analyticsData, setAnalyticsData] = useState([]);

  // turns on/off (edit, delete) mode
  useEffect(() => {
    if (numSelectedRows <= 0) {
      setEditMode(false);
      setDeleteMode(false);
    } else {
      setDeleteMode(true);
    }

    if (numSelectedRows === 1) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [numSelectedRows, setEditMode, setDeleteMode]);

  useEffect(() => {
    setRows([]);
    if (reloadData) {
      reload();
      setReloadData(false);
    }
  }, [reloadData]);

  useEffect(() => {
    setReloadData(true);
  }, [currentPage, rowsPerPage, activeSortColumn, sortDirection, filter]);

  const handleOptionsClick = (type) => {
    setDialog(type);
    if (type === "refresh") {
      setReloadData(true);
    } else if (type === "predict") {
      onPredictClick();
    } else setShowDialog(true);
  };

  const onPredictClick = () => {
    setLoading(true);
    const docIds = [];
    Object.keys(selectedRows).forEach((key) => {
      docIds.push(parseInt([selectedRows[key]["doc_id"]]));
    });

    let dataObj = Object.values(selectedRows);
    dataObj = JSON.parse(JSON.stringify(dataObj));

    let aging = {};
    predictData({ data: docIds })
      .then(({ data }) => {
        data.forEach((d) => {
          const temp = parseInt(d["doc_id"]);
          aging[temp] = d.aging_bucket;
        });

        dataObj.forEach((obj) => {
          obj["aging_bucket"] = "Nan";
          if (aging[obj["doc_id"]] !== undefined) {
            obj["aging_bucket"] = aging[obj["doc_id"]];
          }
        });

        updateData(dataObj).then(() => {
          setLoading(false);
          setDialog("predict");
          setShowDialog(true);
          setReloadData(true);
        });
      })
      .catch(() => {
        setLoading(false);
        setAlertSeverity("error");
        setAlertMessage("Failed to get predictions");
        setShowAlert(true);
        setReloadData(true);
      });
  };

  const onAddClick = (dataObj) => {
    setShowDialog(false);
    setLoading(true);
    postData(dataObj)
      .then(() => {
        setLoading(false);
        setAlertSeverity("success");
        setAlertMessage("Data Added Successfully");
        setShowAlert(true);
        setReloadData(true);
      })
      .catch(() => {
        setLoading(false);
        setAlertSeverity("error");
        setAlertMessage("Failed to Add Data");
        setShowAlert(true);
        setReloadData(true);
      });
  };

  const onEditClick = (invoiceCurrency, cust_terms) => {
    setShowDialog(false);
    setLoading(true);

    let dataObj = Object.values(selectedRows)[0];

    // deep copying
    dataObj = JSON.parse(JSON.stringify(dataObj));

    if (invoiceCurrency) {
      dataObj.invoice_currency = invoiceCurrency;
    }

    if (cust_terms) {
      dataObj.cust_payment_terms = cust_terms;
    }

    if (!invoiceCurrency && !cust_terms) {
      setLoading(false);
      setAlertMessage("No Changes Were Made.");
      setAlertSeverity("info");
      setShowAlert(true);
    } else {
      updateData(dataObj)
        .then(() => {
          setLoading(false);
          setAlertSeverity("success");
          setAlertMessage("Successfully Edited The Data");
          setShowAlert(true);
          setReloadData(true);
        })
        .catch(() => {
          setLoading(false);
          setAlertSeverity("error");
          setAlertMessage("Failed To Edit The Data");
          setShowAlert(true);
        });
    }
  };

  const onDeleteClick = () => {
    setShowDialog(false);
    setLoading(true);

    deleteData(Object.values(selectedRows))
      .then(() => {
        setLoading(false);
        setAlertSeverity("success");
        setAlertMessage("Successfully deleted the record(s)");
        setShowAlert(true);
        setReloadData(true);
      })
      .catch((e) => {
        setLoading(false);
        setAlertSeverity("error");
        setAlertMessage("Deletion failed!");
        setShowAlert(true);
      });
  };

  const onAdvanceSearch = (docId, invoiceId, custNumber, year) => {
    setShowDialog(false);
    setLoading(true);
    if (!docId && !invoiceId && !custNumber && !year) {
      setLoading(false);
      setAlertMessage("No input were given");
      setAlertSeverity("info");
      setShowAlert(true);
    } else {
      setReloadData(true);
    }

    let newFilter = {};
    if (docId) {
      newFilter["doc_id"] = docId;
    }
    if (invoiceId) {
      newFilter["invoice_id"] = invoiceId;
    }
    if (custNumber) {
      newFilter["cust_number"] = custNumber;
    }
    if (year) {
      newFilter["buisness_year"] = year;
    }

    setFilter(newFilter);
  };

  const onAnalyticsClick = (clearDate, dueDate, baselineDate, invoiceCurr) => {
    setLoading(true);
    setShowDialog(false);
    if (!clearDate[0] && !dueDate[0] && !baselineDate[0] && !invoiceCurr) {
      setLoading(false);
      setAlertMessage("No input were given");
      setAlertSeverity("info");
      setShowAlert(true);
    } else {
      let newFilter = { analytics: true };
      if (clearDate[0] && clearDate[1]) {
        newFilter["clearDateFrom"] = clearDate[0];
        newFilter["clearDateTo"] = clearDate[1];
      }

      if (dueDate[0] && dueDate[1]) {
        newFilter["dueDateFrom"] = dueDate[0];
        newFilter["dueDateTo"] = dueDate[1];
      }

      if (baselineDate[0] && baselineDate[1]) {
        newFilter["baselineDateFrom"] = baselineDate[0];
        newFilter["baselineDateTo"] = baselineDate[1];
      }

      if (invoiceCurr) {
        newFilter["invoiceCurr"] = invoiceCurr;
      }

      fetchData(
        currentPage,
        rowsPerPage,
        activeSortColumn,
        sortDirection,
        newFilter
      )
        .then((data) => {
          setAnalyticsData(data);
          setDialog("chart");
          setShowDialog(true);
          setLoading(false);
        })
        .catch(() => {
          setAlertSeverity("error");
          setAlertMessage("Failed to load data");
          setShowAlert(true);
          setLoading(false);
          setShowDialog(false);
        });
    }
  };

  const onCancelClick = () => {
    setShowDialog(false);
    setAlertSeverity("warning");
    setAlertMessage("Cancelled by user");
    setShowAlert(true);
  };

  const reload = () => {
    setLoading(true);
    setNumSelectedRows(0);
    setSelectedRows({});

    fetchData(currentPage, rowsPerPage, activeSortColumn, sortDirection, filter)
      .then((data) => {
        const temp = data.pop();
        console.log(data);
        setTotalRows(parseInt(temp.totalRows));
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setAlertSeverity("error");
        setAlertMessage("Failed to load data");
        setShowAlert(true);
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      {/* dailogbox */}
      <Dialog
        open={showDialog}
        maxWidth={"lg"}
        fullScreen={dialog === "chart" ? true : false}
      >
        {dialog === "add" ? (
          <>
            <DialogTitle>ADD</DialogTitle>
            <Divider />
            <Add
              open={showDialog && dialog === "add"}
              setOpen={setShowDialog}
              onAddClick={onAddClick}
              onCancelClick={onCancelClick}
            />
          </>
        ) : null}

        {dialog === "edit" ? (
          <>
            <DialogTitle>Edit</DialogTitle>
            <Divider />
            <EditInvoice
              onCancelClick={onCancelClick}
              onEditClick={onEditClick}
            />
          </>
        ) : null}

        {dialog === "delete" ? (
          <>
            <DialogTitle>Delete</DialogTitle>
            <Divider />
            <DeleteInvoice
              onDeleteClick={onDeleteClick}
              onCancelClick={onCancelClick}
            />
          </>
        ) : null}

        {/* advanced search */}
        {dialog === "advancedsearch" ? (
          <>
            <DialogTitle>Advance Search</DialogTitle>
            <AdvancedSearch
              onSearchClick={onAdvanceSearch}
              onCancelClick={onCancelClick}
            />
          </>
        ) : null}

        {/* analytics view */}
        {dialog === "analytics" ? (
          <>
            <DialogTitle>Analytics view</DialogTitle>

            <AnalyticsView
              onAnalyticsClick={onAnalyticsClick}
              onCancelClick={onCancelClick}
            />
          </>
        ) : null}

        {/* Chart */}
        {dialog === "chart" ? (
          <BarChart
            analyticsData={analyticsData}
            setShowDialog={setShowDialog}
          />
        ) : null}

        {/* Prediction */}
        {dialog === "predict" ? (
          <>
            <DialogTitle>Prediction</DialogTitle>
            <Divider />
            <div className="prediction">
              <div>Prediction Data Updated Successfully.</div>
              <div className="prediction-button">
                <Button
                  variant="contained"
                  onClick={() => setShowDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </Dialog>

      <InvoiceOptions
        deleteMode={deleteMode}
        editMode={editMode}
        handleOptionsClick={handleOptionsClick}
      >
        <Search filter={filter} setFilter={setFilter} />
      </InvoiceOptions>
      <InvoiceList
        rows={rows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        numSelectedRows={numSelectedRows}
        setNumSelectedRows={setNumSelectedRows}
        activeSortColumn={activeSortColumn}
        setActiveSortColumn={setActiveSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={totalRows} // total records in db
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={(e, page) => {
          setCurrentPage(page);
        }}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(e.target.value);
        }}
        showFirstButton
        showLastButton
      />

      <Snackbar
        open={showAlert}
        autoHideDuration={2500}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>

      {/* for loading */}
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress />
      </Backdrop>
    </ThemeProvider>
  );
}

export default Dashboard;
