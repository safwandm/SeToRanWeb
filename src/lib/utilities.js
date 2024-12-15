import Cookies from "js-cookie";

// mungkin bisa buat api client lib seperti flutter

export let backendHost = "http://127.0.0.1:8000"

/**
 * Sends an authenticated fetch request.
 *
 * @param {RequestInfo} input - The resource that you want to fetch.
 * @param {RequestInit} [init={}] - An options object containing custom settings for the fetch request.
 * @returns {Promise<Response>} A promise that resolves to the response to the request.
 */
export function fetchAuth(input, init = {}) {
    return fetch(
        backendHost + input, 
        {
            ...init,
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + Cookies.get('access_token'),
                ...init.headers
            }
        }
    );
}

/**
 * Sends an authenticated POST request with a JSON payload.
 *
 * @param {RequestInfo} input - The resource that you want to fetch.
 * @param {any} data - The data to send as the request body.
 * @param {RequestInit} [init={}] - An options object containing custom settings for the fetch request.
 * @returns {Promise<Response>} A promise that resolves to the response to the request.
 */
export function postAuth(input, data, init = {}) {
    return fetch(
        backendHost + input, 
        {
            method: 'POST',
            ...init,
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + Cookies.get('access_token'),
                ...init.header
            },
        }
    );
}