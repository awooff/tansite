import axios, {type AxiosError, type AxiosResponse } from 'axios';

export const apiUrl = require('process').env.API_URL || 'http://localhost:1337';

export const postRequestHandler = <T>(
	route: string,
	data: object,
	onSuccess?: (data: AxiosResponse<T>) => unknown,
	setError?: (error: Error) => unknown
) =>
	new Promise((resolve, reject) => {
		(async () => {

			if (route[0] !== '/')
				route = '/' + route;

			try {
				const result = await axios.post(apiUrl + route, data, {
					withCredentials: true,
					headers: {
						Authorization: "Bearer " + localStorage.getItem('jwt')
					}
				})

				if (onSuccess)
					await onSuccess(result)

				resolve(true);
			} catch (error) {
				const axiosError = error as AxiosError<any, any>;
				const result = axiosError.response;
				const resultError = result?.data?.error || result?.data || error;

				let issue = "";
				if (!resultError.message) {
					// Zod Error
					if (resultError.issues)
						issue = resultError.issues.map((issue: any) => {
							return issue.message
						}).join('\n')
					else
						issue = "internal server error"
				} else
					issue = resultError.message

				if (setError)
					await setError(new Error(issue.toLowerCase()))

				reject(issue)
			}
		})();
	})
