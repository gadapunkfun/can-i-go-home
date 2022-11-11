import axios, { AxiosError, type AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";

async function GetVasttrafikAccessToken() {
	const data = await fetch("https://api.vasttrafik.se:443/token", {
		body: "grant_type=client_credentials",
		headers: {
			Authorization: `Basic ${import.meta.env.VITE_API_KEY}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
	});
	return (await data.json()).access_token as string;
}

let ACCESS_TOKEN = "";

const AXIOS_CONFIG: AxiosRequestConfig = {
	httpsAgent: {
		rejectUnauthorized: false
	},
	headers: {
		Authorization: `Bearer ${ACCESS_TOKEN}`,
		"Access-Control-Allow-Origin": location.origin
	}
};

export class DefResponse<T> {
	isSuccessStatusCode: boolean;
	result: T;
	constructor(status: number, result: T) {
		this.isSuccessStatusCode = status >= 200 && status <= 299;
		this.result = result;
	}
}

export class BaseService {
	url: string;

	constructor(url: string, parameter?: string) {
		if (parameter) this.url = url + `/${parameter}`;
		else this.url = url;
		if (ACCESS_TOKEN === "") {
			GetVasttrafikAccessToken().then(resp => {
				ACCESS_TOKEN = resp;
			});
		}
	}

	async Get<T>() {
		try {
			const resp = await axios.get(this.url, AXIOS_CONFIG);
			return new DefResponse(resp.status, resp.data as T);
		} catch (err) {
			const error = err as AxiosError;
			if (error.response?.status === 401) {
				const accessToken = await GetVasttrafikAccessToken();
				AXIOS_CONFIG.headers = {
					Authorization: `Bearer ${accessToken}`,
					"Access-Control-Allow-Origin": location.origin
				};
				ACCESS_TOKEN = accessToken;
				const resp = await axios.get(this.url, AXIOS_CONFIG);
				return new DefResponse(resp.status, resp.data as T);
			} else {
				return new DefResponse(500, null);
			}
		}
	}

	async Post<T>(data: object) {
		const resp = await axios.post(this.url, data, AXIOS_CONFIG);
		return new DefResponse<T>(resp.status, resp.data);
	}

	async Put<T>(data: object) {
		const resp = await axios.put(this.url, data, AXIOS_CONFIG);
		return new DefResponse<T>(resp.status, resp.data);
	}

	async Patch<T>(data: object) {
		const resp = await axios.patch(this.url, data, AXIOS_CONFIG);
		return new DefResponse(resp.status, resp.data as T);
	}

	async Delete<T>() {
		const resp = await axios.delete(this.url, AXIOS_CONFIG);
		return new DefResponse(resp.status, resp.data as T);
	}
}
