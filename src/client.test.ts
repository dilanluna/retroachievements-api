import { Client } from './client';

describe('Client', () => {
	test('', () => {
		// @ts-ignore
		const client = new Client(process.env.RETROACHIEVEMENTS_USERNAME, process.env.RETROACHIEVEMENTS_API_KEY);
		console.log(client);

		// client.game({ gameId: 1 }).then((data) => console.log(data));
		// client.gameExtended({ gameId: 1 }).then((data) => console.log(data));
		// client.userRank({ gameId: 1 }).then((data) => console.log(data));
	});
});
