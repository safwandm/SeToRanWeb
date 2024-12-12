
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
        input, 
        {
            ...init,
            headers: {
                // 'Authorization': "Bearer " + this.cookiesProvider.get('accessToken'),
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
        input, 
        {
            method: 'POST',
            ...init,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': "Bearer " + this.cookiesProvider.get('accessToken'),
                ...init.headers
            }
        }
    );
}