module.exports = (query) => {
    let objectSearch = {
        search: "",
    };
    if (query.search) {
        objectSearch.search = query.search;
        const regex = new RegExp(objectSearch.search, "i");
        objectSearch.regex = regex;
    }
    return objectSearch
};
