import FetchRestProvider from "./FetchRestProvider";

const URL_API_PADRAO = "http://localhost:5228";

export const URL_API = process.env.NEXT_PUBLIC_API_URL ?? URL_API_PADRAO;

export const api = new FetchRestProvider(URL_API);
