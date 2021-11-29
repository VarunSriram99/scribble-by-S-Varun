import axios from "axios";

const fetchCategories = () => axios.get("/api/categories");
const create = payload => axios.post("/api/categories", payload);
const update = (id, payload) => axios.put(`/api/categories/${id}`, payload);
const destroy = id => axios.delete(`/api/categories/${id}`);

const categoriesApi = { fetchCategories, create, update, destroy };

export default categoriesApi;
