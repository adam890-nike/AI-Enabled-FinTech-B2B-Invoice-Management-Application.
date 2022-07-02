import React, { useState, useEffect } from "react";

import { CssBaseline, Grid, Link, ThemeProvider } from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import CopyrightIcon from "@mui/icons-material/Copyright";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Dashboard from "./component/Dashboard";
import theme from "./style/theme";
import { Box } from "@mui/system";
import BarChart from "./component/chart/BarChart";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Grid container>
                <Grid
                    item
                    sx={{
                        display: "flex",
                    }}
                    xs={12}
                    md={5}
                >
                    <BusinessIcon
                        sx={{ ml: 2, mr: 1, mt: 2 }}
                        fontSize="large"
                    />

                    <Typography sx={{ mt: 2 }} variant="h6" fontSize={27}>
                        ABC Products
                    </Typography>
                </Grid>

                <Grid item xs={12} md={7} sx={{ pt: 2 }}>
                    <img src="./hrcLogo.png" width={"180px"} />
                </Grid>
            </Grid>

            <Paper
                sx={{
                    backgroundImage: "none",
                    mb: 1,
                    width: "100%",
                    pt: 2,
                }}
            >
                <Dashboard />
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 4,
                    fontSize: "0.9em",
                }}
            >
                <Link href="#">Privacy Policy</Link>
                <Typography> | </Typography>
                <CopyrightIcon fontSize="0.9em" />
                <Typography fontSize="0.8em">
                    {"  "}
                    2022 HighRadius Corporation. All rights reserved.
                </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default App;
