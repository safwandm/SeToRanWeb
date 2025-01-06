import Cookies from "js-cookie";

export let backendHost = "http://127.0.0.1:8000";

/**
 * harus input cookie provider kalau di pake di file .server.ts/js
 */
export class BaseApi {
  static ins: BaseApi

  private cookieProvider: any;

  constructor(cookieProvider?: any) {
    this.cookieProvider = cookieProvider || Cookies;
  }

  static initInstance(cookieProvider?: any) {
    this.ins = new BaseApi(cookieProvider)
  }

  async fetchAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    const accessToken = this.cookieProvider.get("access_token");

    return fetch(backendHost + input, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
  }

  async postAuth(input: RequestInfo, data: any, init: RequestInit = {}): Promise<Response> {
    const accessToken = this.cookieProvider.get("access_token");

    return fetch(backendHost + input, {
      method: "POST",
      ...init,
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
  }

  async deleteAuth(input: RequestInfo, data: any, init: RequestInit = {}): Promise<Response> {
    const accessToken = this.cookieProvider.get("access_token");

    return fetch(backendHost + input, {
      method: "DELETE",
      ...init,
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
  }
}