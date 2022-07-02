import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

function AdvancedSearch({ onSearchClick, onCancelClick }) {
    const [docId, setDocId] = useState("");
    const [invoiceId, setInvoiceId] = useState("");
    const [custNumber, setCustNumber] = useState("");
    const [year, setYear] = useState("");

    return (
        <>
            <Grid container direction={"column"} spacing={2} sx={{ mb: 2 }}>
                <Grid item sx={{ ml: 3, mr: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Document ID"
                                value={docId}
                                onChange={(e) => setDocId(e.target.value)}
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Invoice ID"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer Number"
                                value={custNumber}
                                onChange={(e) => setCustNumber(e.target.value)}
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                label="Business Year"
                                required={false}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Container sx={{ display: "flex" }}>
                        <button
                            onClick={() => {
                                onSearchClick(
                                    docId,
                                    invoiceId,
                                    custNumber,
                                    year
                                );
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
        </>
    );
}

export default AdvancedSearch;
