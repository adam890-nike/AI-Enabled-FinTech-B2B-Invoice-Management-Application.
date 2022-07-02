import axios from "axios";

const predictData = async (dataObject) => { 
    try {
        return await axios.post("http://127.0.0.1:5000/get_prediction", dataObject, {
            params: {
                type: "post",
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        
    } catch (e) {
        throw e;
    }
};

export default predictData;