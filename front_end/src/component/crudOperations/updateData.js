import axios from "axios";

async function updateData(dataObject) {
    console.log(dataObject);
    try {
        await axios.put(
            "http://localhost:8080/HRC_Backend/HRC_Manager",
            dataObject,
            {
                params: {
                    sl_no: dataObject.sl_no,
                    custTerms: dataObject.cust_payment_terms,
                    invoiceCurr: dataObject.invoice_currency,
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

export default updateData;
