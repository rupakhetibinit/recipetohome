// Hook for fetching data from the server

import { useEffect, useState } from 'react';

export default useFetch = (url, options = {}) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const res = await fetch(url, options);
				const json = await res.json();
				setData(json);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
};
