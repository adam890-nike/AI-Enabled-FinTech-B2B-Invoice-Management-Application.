import React, { useEffect, useState } from "react";

import DatePicker from "@mui/lab/DatePicker";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";

function DatePick({ label, required, column, isInvalid, callBack }) {
    const [value, setValue] = useState(null);
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
                label={label}
                value={isInvalid ? NaN : value}
                disableFuture
                mask="____/__/__"
                inputFormat="YYYY/MM/DD"
                onChange={(e) => {
                    if (e && e.year()) {
                        const year = e.year();
                        let day = e.date();
                        let month = e.month() + 1;
                        if (day < 10) day = "0" + day;
                        if (month < 10) month = "0" + month;
                        const st = year + "-" + month + "-" + day;
                        setValue(new Date(st));
                        column.value = st;
                        callBack();
                    } else {
                        column.value = null;
                    }
                }}
                allowSameDateSelection
                renderInput={(params) => (
                    <TextField
                        disabled
                        required={required}
                        variant="outlined"
                        {...params}
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DatePick;
