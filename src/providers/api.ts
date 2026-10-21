import FetchRestProvider from "./FetchRestProvider";

const URL_API_PADRAO = "http://localhost:5228";

export const api = new FetchRestProvider(process.env.NEXT_PUBLIC_API_URL ?? URL_API_PADRAO);
