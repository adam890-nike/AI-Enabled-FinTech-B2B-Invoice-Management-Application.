import axios from "axios";

async function deleteData(dataObject) {
    // dataObject contains selected row (array)
    const dataArray = [];
    dataObject.forEach((obj) => {
        dataArray.push(obj["sl_no"]);
    });

    try {
        await axios.post(
            "http://localhost:8080/HRC_Backend/HRC_Manager",
            dataArray,
            {
                params: {
                    type: "delete",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return true;
    } catch (e) {
        throw e;
    }
}

export default deleteData;
