import axios from "axios";

const fetchCategories = () => axios.get("/api/categories");
const create = payload => axios.post("/api/categories", payload);
const update = (id, payload) => axios.put(`/api/categories/${id}`, payload);
const destroy = id => axios.delete(`/api/categories/${id}`);
const reorder = payload => axios.post("api/categories/reorder", payload);

const categoriesApi = { fetchCategories, create, update, destroy, reorder };

export default categoriesApi;
