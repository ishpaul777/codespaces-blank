function generateFakeData() {
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	const data = [];

	for (let i = 0; i < 12; i++) {
		const monthData = {
			month: months[i],
			days: []
		};

		const daysInMonth = new Date(2023, i + 1, 0).getDate();

		for (let j = 1; j <= daysInMonth; j++) {
			const creditsUsed = Math.floor(Math.random() * 1000);
			monthData.days.push({ day: j, creditsUsed });
		}

		data.push(monthData);
	}

	return data;
}

// Example usage
const fakeData = generateFakeData();

export { fakeData }
