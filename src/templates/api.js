import axios from 'axios'

export default function API(url) {
	return axios
		.get(url, {
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'X-JSON-Header': 'true'
			}
		})
		.then(({ data }) => data)
}
