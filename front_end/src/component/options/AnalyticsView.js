
import {
    Alert,
    Button,
    Container,
    Grid,
    IconButton,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import React, { useEffect, useState } from "react";

function AnalyticsView({ onAnalyticsClick, onCancelClick }) {
    const [clearDate, setClearDate] = useState(["", ""]);
    const [dueDate, setDueDate] = useState(["", ""]);
    const [baselineDate, setBaselineDate] = useState(["", ""]);
    const [invoiceCurr, setInvoiceCurr] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const [invalidCols, setInvalidCols] = useState([]);
    const validateData = () => {
        if (
            (clearDate[0] && !clearDate[1]) ||
            (clearDate[1] && !clearDate[0]) ||
            (dueDate[0] && !dueDate[1]) ||
            (dueDate[1] && !dueDate[0]) ||
            (baselineDate[0] && !baselineDate[1]) ||
            (baselineDate[1] && !baselineDate[0])
        ) {
            setShowAlert(true);
        } else {
            onAnalyticsClick(clearDate, dueDate, baselineDate, invoiceCurr);
        }
    };

    return (
        <>
            <Grid
                container
                direction={"column"}
                spacing={2}
                sx={{ mb: 2, mt: 3, maxWidth: "600px" }}
            >
                <Grid item>
                    {/* textfields */}
                    <Container>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                {/* Clear date */}
                                <Typography>Clear Date</Typography>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="From"
                                        required={false}
                                        value={clearDate[0]}
                                        onChange={(e) => {
                                            let cleardate = [
                                                e.target.value,
                                                clearDate[1],
                                            ];

                                            setClearDate(cleardate);
                                        }}
                                    />
                                </div>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="To"
                                        required={false}
                                        value={clearDate[1]}
                                        onChange={(e) => {
                                            let cleardate = [
                                                clearDate[0],
                                                e.target.value,
                                            ];
                                            setClearDate(cleardate);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Due date */}
                                <Typography>Due Date</Typography>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="From"
                                        required={false}
                                        value={dueDate[0]}
                                        onChange={(e) => {
                                            let duedate = [
                                                e.target.value,
                                                dueDate[1],
                                            ];
                                            setDueDate(duedate);
                                        }}
                                    />
                                </div>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="To"
                                        required={false}
                                        value={dueDate[1]}
                                        onChange={(e) => {
                                            let duedate = [
                                                dueDate[0],
                                                e.target.value,
                                            ];
                                            setDueDate(duedate);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Baseline Create Date */}
                                <Typography>Baseline Create Date</Typography>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="From"
                                        required={false}
                                        value={baselineDate[0]}
                                        onChange={(e) => {
                                            let baselinedate = [
                                                e.target.value,
                                                baselineDate[1],
                                            ];
                                            setBaselineDate(baselinedate);
                                        }}
                                    />
                                </div>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        type={"date"}
                                        label="To"
                                        required={false}
                                        value={baselineDate[1]}
                                        onChange={(e) => {
                                            let baselinedate = [
                                                baselineDate[0],
                                                e.target.value,
                                            ];
                                            setBaselineDate(baselinedate);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Invoice Currency */}
                                <Typography>Invoice Currency</Typography>
                                <div style={{ margin: "0.4rem 0.5rem" }}>
                                    <TextField
                                        label="Invoice Currency"
                                        required={false}
                                        value={invoiceCurr}
                                        onChange={(e) => {
                                            setInvoiceCurr(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </Grid>
                {/* buttons */}
                <Grid item>
                    <Container sx={{ display: "flex" }}>
                        <button
                            onClick={() => {
                                validateData();
                            }}
                            style={{ marginRight: "0.3rem" }}
                            className="btn"
                        >
                            Search
                        </button>
                        <button
                            onClick={onCancelClick}
                            style={{ marginLeft: "0.3rem" }}
                            className="btn"
                        >
                            Cancel
                        </button>
                    </Container>
                </Grid>
            </Grid>

            <Snackbar
                open={showAlert}
                autoHideDuration={3500}
                onClose={() => setShowAlert(false)}
            >
                <Alert severity={"error"}>
                    Make sure to fill both "from/to" column
                </Alert>
            </Snackbar>
        </>
    );
}

export default AnalyticsView;
