import axios from "axios";

export default async function api(path: any) {
  return axios.get(path);
}
