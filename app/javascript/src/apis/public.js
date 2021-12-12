import axios from "axios";

const fetchCategoriesWithArticles = () => axios.get("/api/public");
const show = slug => axios.get(`/api/public/${slug}`);

const publicApi = { fetchCategoriesWithArticles, show };

export default publicApi;
