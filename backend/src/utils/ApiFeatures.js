class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i" // case insensitive
                }
            } :
            {}

        //to find products whose name is equals to the value of keyword 
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        // Removing some fields from category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryStrCopy[key]);

        // Filter for pricing and rate
        let queryString = JSON.stringify(queryStrCopy);
        queryString = queryString.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`)
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    // Pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeatures;