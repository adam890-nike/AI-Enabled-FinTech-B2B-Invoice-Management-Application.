import React, { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Container,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

function InvoiceOptions({
    editMode,
    deleteMode,
    handleOptionsClick,
    children,
}) {
    return (
        <>
            <Grid container spacing={1} mt={1}>
                {/* 1st group */}
                <Grid item xs={12} md={5}>
                    <Container sx={{ display: "flex" }}>
                        <ButtonGroup variant="outlined" fullWidth>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!deleteMode} // delete and predict button becomes active at same conditions

                                onClick={() => {
                                    handleOptionsClick("predict");
                                }}
                            >
                                <Typography variant="button">
                                    Predict
                                </Typography>
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleOptionsClick("analytics")}
                            >
                                <Typography noWrap variant="button">
                                    Analytics view
                                </Typography>
                            </Button>
                            <Button
                                onClick={() =>
                                    handleOptionsClick("advancedsearch")
                                }
                                size="small"
                            >
                                <Typography noWrap variant="button">
                                    Advance Search
                                </Typography>
                            </Button>
                        </ButtonGroup>
                        <Tooltip title="Reload Data">
                            <IconButton
                                onClick={() => handleOptionsClick("refresh")}
                                color={"primary"}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "primary.main",
                                    borderRadius: 1,
                                    ml: 1,
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Container>
                </Grid>

                {/* 2nd group */}
                <Grid item xs={12} md={2}>
                    <Box
                        component={"span"}
                        sx={{
                            display: "flex",
                            pl: 2,
                            pr: 3,
                        }}
                    >
                        {/* search bar */}
                        {children}
                    </Box>
                </Grid>

                {/* 3rd group */}
                <Grid item xs={12} md={5}>
                    <Container sx={{ display: "flex" }}>
                        {/* <ButtonGroup fullWidth variant="outlined"> */}
                        <Button
                            onClick={() => handleOptionsClick("add")}
                            variant="outlined"
                        >
                            <Typography>Add</Typography>
                        </Button>
                        <Button
                            onClick={() => handleOptionsClick("edit")}
                            variant="outlined"
                            disabled={!editMode}
                        >
                            <Typography>Edit</Typography>
                        </Button>
                        <Button
                            onClick={() => {
                                handleOptionsClick("delete");
                            }}
                            variant="outlined"
                            disabled={!deleteMode}
                        >
                            <Typography>Delete</Typography>
                        </Button>
                        {/* </ButtonGroup> */}
                    </Container>
                </Grid>
            </Grid>
        </>
    );
}

export default InvoiceOptions;
