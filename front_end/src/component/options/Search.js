import React, { useEffect, useState } from "react";
import { TextField, ThemeProvider } from "@mui/material";

import theme from "../../style/theme";

function Search({ setFilter }) {
    const [value, setValue] = useState("");
    useEffect(() => {
        const pid = setTimeout(() => {
            if (value) {
                setFilter({ cust_number: value });
            } else {
                setFilter({});
            }
        }, 700);
        return () => {
            clearTimeout(pid);
        };
    }, [value]);
    return (
        <ThemeProvider theme={theme}>
            <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                label="Search Customer Id"
                size="small"
                autoComplete="off"
                required={false}
            />
        </ThemeProvider>
    );
}

export default Search;
