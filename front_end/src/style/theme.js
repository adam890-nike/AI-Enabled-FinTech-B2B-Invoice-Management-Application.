import { createTheme } from "@mui/material/styles";

let theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#2f3d4e",
            paper: "#283d4a",
            // default: "red",
            // default: "#1A132F",
            // default: "#39495e",
            // paper: "#1A132F",
        },
        primary: {
            main: "#14aff1",
        },
    },

    components: {
        MuiTypography: {
            defaultProps: {
                color: "textPrimary",
                fontSize: "0.85rem",
            },
        },
        MuiButton: {
            defaultProps: {
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    paddingTop: "0.6em",
                    paddingBottom: "0.6em",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
                variant: "standard",
                required: true,
                color: "primary",
                sx: {
                    backgroundColor: "white",
                    borderRadius: "0.3rem",
                    margin: 0,
                    padding: 0,
                },
                InputLabelProps: {
                    sx: {
                        color: "#3d3d3d",
                        fontSize: "0.95rem",
                        ml: 1,
                    },
                },
                inputProps: {
                    sx: {
                        color: "black",
                        ml: 1,
                    },
                },
            },
        },
    },
});
export default theme;
