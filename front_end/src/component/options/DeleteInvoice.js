import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";

function DeleteInvoice({ onDeleteClick, onCancelClick }) {
    return (
        <>
            <Grid container direction={"column"} spacing={2}>
                <Grid item>
                    <Typography variant="body2" sx={{ ml: 2, mr: 2, mt: 2 }}>
                        Are you sure you want to delete record(s)?
                    </Typography>
                </Grid>
                <Grid item>
                    <Container sx={{ display: "flex" }}>
                        <button
                            onClick={onCancelClick}
                            className="btn"
                            style={{ marginRight: "0.3rem" }}
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onDeleteClick}
                            className="btn"
                            style={{ marginLeft: "0.3rem" }}
                        >
                            DELETE
                        </button>
                    </Container>
                </Grid>
            </Grid>
        </>
    );
}

export default DeleteInvoice;
