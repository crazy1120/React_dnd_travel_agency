
export const FRONT_END_DOMAIN = import.meta.env.VITE_FRONT_END_HOST.split(":")[0];

export const BACKEND_BASE_URL = `${import.meta.env.VITE_BE_PROTOCOL}://${import.meta.env.VITE_BACK_END_HOST}`;