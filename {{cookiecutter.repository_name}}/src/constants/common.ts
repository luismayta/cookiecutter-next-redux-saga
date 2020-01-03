/* eslint-disable prefer-destructuring */
// Environment variables
export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEV = NODE_ENV !== 'production';
export const PORT = process.env.PORT;
export const SESSION_SECRET = process.env.SESSION_SECRET;

export const COMMON_ERROR = 'Unexpected Error';
export const UNAUTHORIZED_ERROR = 'Unauthorized Error';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const PERSIST_STORE = 'persist:app';
