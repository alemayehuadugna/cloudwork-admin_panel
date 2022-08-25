import axios from "axios";
import { Message } from "element-ui";
import { UserModule } from "@/modules/user/interface/store";
import Qs from "qs";

const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	timeout: 6000,
});

service.defaults.validateStatus = (status: number) => {
	return status >= 200 && status < 300;
};

// Request interceptors
service.interceptors.request.use(
	(config) => {
		config.paramsSerializer = params => {
			// Qs is not included in the Axios package
			return Qs.stringify(params, {
				arrayFormat: "brackets",
				encode: false
			});
		};

		// Add X-Access-Token header to every request, you can add other custom headers here
		if (UserModule.token) {
			config.headers.authorization = "Bearer " + UserModule.token;
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	}

);

// Response interceptors
service.interceptors.response.use(

	(response) => {
		const res = response.data;
		return res;
	},
	(error) => {
		console.log("response error: ", error);
		return Promise.reject(error);
	}
);

export default service;
