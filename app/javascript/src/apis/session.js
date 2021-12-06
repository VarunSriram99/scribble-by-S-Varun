import axios from "axios";

const create = payload => axios.post("/api/sessions", payload);

const sessionsApi = { create };

export default sessionsApi;
