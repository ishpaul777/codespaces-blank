import { useEffect, useState } from "react";

const useSocket = (url) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketInstance = new WebSocket(url);
		setSocket(socketInstance);

		// Clean up the socket connection on unmount
		return () => {
			socketInstance.close();
		};
	}, [url]);

	return socket;
};

export default useSocket;
