import axios from "axios";

const fetchRedirectionsData = () => axios.get("/api/redirections");
const create = payload => axios.post("/api/redirections", payload);
const update = (id, payload) => axios.put(`/api/redirections/${id}`, payload);
const destroy = id => axios.delete(`/api/redirections/${id}`);

const redirectionsApi = { fetchRedirectionsData, create, update, destroy };

export default redirectionsApi;
