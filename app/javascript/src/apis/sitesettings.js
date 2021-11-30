import axios from "axios";

const update = payload => axios.put(`/api/site_settings/1`, payload);
const fetchSiteSettings = () => axios.get("api/site_settings");

const siteSettingsApi = { update, fetchSiteSettings };

export default siteSettingsApi;
