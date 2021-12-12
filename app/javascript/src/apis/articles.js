import axios from "axios";

const fetchArticles = () => axios.get("/api/articles");
const create = payload => axios.post("/api/articles", { article: payload });
const show = id => axios.get(`/api/articles/${id}`);
const update = (id, payload) =>
  axios.put(`/api/articles/${id}`, { article: payload });
const destroy = id => axios.delete(`/api/articles/${id}`);

const articlesApi = { fetchArticles, create, show, update, destroy };

export default articlesApi;
