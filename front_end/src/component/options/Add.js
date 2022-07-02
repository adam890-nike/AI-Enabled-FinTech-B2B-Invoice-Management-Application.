import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Container,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import theme from "../../style/theme";
import DatePick from "./Datepicker";

import getDataObject from "../crudOperations/dataObjectTemplate";

const gridTheme = createTheme(
    {
        components: {
            MuiGrid: {
                defaultProps: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                },
            },
        },
    },
    theme
);

let dataObj = getDataObject();

// ----------- Component ------------ //
const AddInvoice = ({ onAddClick, onCancelClick }) => {
    // invalid fields array
    const [invalidFields, setInvalidFields] = useState([]);

    //flag for failure alert (invalid fields)
    const [failure, setFailure] = useState(false);

    // runs one time only ( when component mounts on screen )
    // set all the column value to null
    useEffect(() => {
        dataObj = getDataObject();
    }, []);

    // validates the data and sets the flag for success or failure
    // this function gets invoked on Add button (onClick)
    const validateData = () => {
        let newInvalid = [];
        dataObj.forEach((column) => {
            if (column.show && column.key !== "sl_no" && column.key !== "aging_bucket") {
                if (!column.value) {
                    if (
                        invalidFields.indexOf(column.key) === -1 &&
                        column.key !== "clear_date"
                    ) {
                        newInvalid.push(column.key);
                    }
                } else {
                    if (column.key === "total_open_amount") {
                        const regex = new RegExp(/[^0-9.]/, "g");
                        if (
                            column.value.match(regex) &&
                            invalidFields.indexOf(column.key) === -1
                        ) {
                            newInvalid.push(column.key);
                        }
                    }

                    if (column.key === "buisness_year") {
                        const regex = new RegExp(/\d\d\d\d/);
                        if (
                            !column.value.match(regex) &&
                            invalidFields.indexOf(column.key) === -1
                        ) {
                            newInvalid.push(column.key);
                        }
                    }

                    if (
                        column.key === "cust_number" ||
                        column.key === "posting_id" ||
                        column.key === "invoice_id"
                    ) {
                        const regex = new RegExp(/[0-9]/);
                        if (
                            !column.value.match(regex) &&
                            invalidFields.indexOf(column.key) === -1
                        ) {
                            newInvalid.push(column.key);
                        }
                    }
                }
            }
        });

        newInvalid = newInvalid.concat(invalidFields);
        setInvalidFields(newInvalid);

        if (invalidFields.length > 0 || newInvalid.length > 0) {
            setFailure(true);
        } else {
            onAddClick(dataObj);
        }
    };

    // removes given column from invalid field array
    const removeColumn = (column) => {
        let newInvalid = [...invalidFields];
        newInvalid = newInvalid.filter((element) => {
            if (element === column) {
                setFailure(false);
                return false;
            }
            return true;
        });
        setInvalidFields(newInvalid);
    };

    return (
        <>
            <Container sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    * Required Fields
                </Typography>

                {/* Fields */}

                <Grid container spacing={4}>
                    <ThemeProvider theme={gridTheme}>
                        {dataObj.map((column) => {
                            if (column.show && column.key !== "sl_no" && column.key != "aging_bucket") {
                                return (
                                    <Grid
                                        key={column.key}
                                        item
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {column.type === "string" ? (
                                            <TextField
                                                error={
                                                    invalidFields.indexOf(
                                                        column.key
                                                    ) !== -1
                                                        ? true
                                                        : false
                                                }
                                                label={column.name}
                                                onChange={(e) => {
                                                    column.value =
                                                        e.target.value;
                                                    removeColumn(column.key);
                                                }}
                                                defaultValue=""
                                            />
                                        ) : (
                                            <TextField
                                                type="date"
                                                error={
                                                    invalidFields.indexOf(
                                                        column.key
                                                    ) !== -1
                                                        ? true
                                                        : false
                                                }
                                                value={
                                                    column.value
                                                        ? column.value
                                                        : "2000-01-01"
                                                }
                                                label={column.name}
                                                onChange={(e) => {
                                                    column.value =
                                                        e.target.value;
                                                    removeColumn(column.key);
                                                }}
                                            />
                                        )}
                                    </Grid>
                                );
                            } else return null;
                        })}
                    </ThemeProvider>
                </Grid>

                {/* Buttons */}

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <button className="btn" onClick={validateData}>
                            Add
                        </button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <button
                            className="btn"
                            onClick={() => {
                                onCancelClick();
                            }}
                        >
                            Cancel
                        </button>
                    </Grid>
                </Grid>
            </Container>

            {/* ********** */}
            <Snackbar
                open={failure}
                autoHideDuration={2300}
                message="Test"
                onClose={() => setFailure(false)}
            >
                <Alert severity="error">
                    Make sure to enter all the details correctly
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddInvoice;
