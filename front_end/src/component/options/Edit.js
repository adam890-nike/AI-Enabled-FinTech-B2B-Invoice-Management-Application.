import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
function EditInvoice({ onEditClick, onCancelClick }) {
    const [invoiceCurrency, setInvoiceCurrency] = useState("");
    const [cust_terms, setCust_terms] = useState("");

    const handleClick = () => {
        onEditClick(invoiceCurrency, cust_terms);
    };
    return (
        <>
            <Grid container direction={"column"} sx={{ p: 2 }}>
                <Grid item>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Invoice Currency"
                                value={invoiceCurrency}
                                onChange={(e) =>
                                    setInvoiceCurrency(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cust Payment Terms"
                                value={cust_terms}
                                onChange={(e) => setCust_terms(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container spacing={1} sx={{ pl: 5, pr: 5 }}>
                        <Grid item xs={12} sm={6}>
                            <button
                                onClick={() => {
                                    handleClick();
                                }}
                                className={"btn"}
                            >
                                Edit
                            </button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <button
                                onClick={() => {
                                    onCancelClick();
                                }}
                                className={"btn"}
                            >
                                Cancel
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default EditInvoice;
