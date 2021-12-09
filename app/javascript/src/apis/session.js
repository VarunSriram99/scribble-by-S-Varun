import axios from "axios";

const create = payload => axios.post("/api/sessions", { login: payload });

const sessionsApi = { create };

export default sessionsApi;
