import axios from "axios";

// takes in dataObjectTemplate and returns the key/value pair of
// column_key and column_value
const makeObject = (dataOjbect) => {
    const dataObj = {};
    dataOjbect.forEach((data) => {
        if (data.key === "clear_date" && data.value === null) {
        } else {
            dataObj[data.key] = data.value;
        }
    });
    return dataObj;
};

const postData = async (dataObject) => {
    const dataObj = makeObject(dataObject);
    try {
        await axios.post("http://localhost:8080/HRC_Backend/HRC_Manager", dataObj, {
            params: {
                type: "post",
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return true;
    } catch (e) {
        throw e;
    }
};

export default postData;
