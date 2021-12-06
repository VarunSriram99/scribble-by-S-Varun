import axios from "axios";

const fetchPublic = () => axios.get("/api/public");
const show = slug => axios.get(`/api/public/${slug}`);

const publicApi = { fetchPublic, show };

export default publicApi;
