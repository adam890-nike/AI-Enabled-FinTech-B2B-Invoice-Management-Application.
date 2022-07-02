import axios from "axios";

const fetchData = async (page, rowsPerPage, sortCol, sortOrder, filter) => {
    const parameters = {
        page: page,
        rowsperpage: rowsPerPage,
        sort: sortCol,
        order: sortOrder,
    };

    // Object.keys returns array with all the keys of object
    // if (Object.keys(filter).length > 0) {
    Object.keys(filter).forEach((key) => {
        parameters[`${key}`] = filter[`${key}`];
    });
    // }

    try {
        const rawData = await axios.get(
            "http://localhost:8080/HRC_Backend/HRC_Manager",
            {
                params: parameters,
            }
        );
        return rawData.data;
    } catch (err) {
        throw err;
    }
};

export default fetchData;
