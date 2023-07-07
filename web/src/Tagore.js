import { useEffect } from 'react';
import useDarkMode from './hooks/useDarkMode'

export default function Tagore({children}) {
	const { darkMode } = useDarkMode();

	useEffect(() => {
		const html = document.querySelector('html');
		if (darkMode) {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}, [darkMode]);

	return (
		<>
		{children}
		</>
	);
}
