declare namespace RetroAchievementsApiResponses {
	interface TopTenPlace {
		user: string;
		score: number;
		trueratio: number;
	}

	interface TopTen {
		top10: {
			place_1: TopTenPlace;
			place_2: TopTenPlace;
			place_3: TopTenPlace;
			place_4: TopTenPlace;
			place_5: TopTenPlace;
			place_6: TopTenPlace;
			place_7: TopTenPlace;
			place_8: TopTenPlace;
			place_9: TopTenPlace;
			place_10: TopTenPlace;
		};
	}

	interface ConsoleId {
		console: [
			Array<{
				ID: number;
				Name: string;
			}>,
		];
	}

	interface GameList {
		game: [
			Array<{
				Title: string;
				ID: number;
				ConsoleID: number;
				ConsoleName: string;
				ImageIcon: string;
				NumAchievements: number;
				NumLeaderboards: number;
				Points: number;
				DateModified: string;
				ForumTopicID: number;
			}>,
		];
	}

	interface GameInfo {
		ID: number;
		Title: string;
		ForumTopicID: number;
		ConsoleID: number;
		ConsoleName: string;
		Flags: number;
		ImageIcon: string;
		GameIcon: string;
		ImageTitle: string;
		ImageIngame: string;
		ImageBoxArt: string;
		Publisher: string;
		Developer: string;
		Genre: string;
		Released: string;
		GameTitle: string;
		Console: string;
	}

	interface GameInfoExtended extends GameInfo {
		IsFinal: boolean;
		GuideURL: null;
		RichPresencePatch: string;
		NumDistinctPlayersCasual: number;
		NumDistinctPlayersHardcore: number;
		NumAchievements: number;
		Claims: [];
		Achievements: {};
	}
}

export class Client {
	static readonly API_URL = 'https://ra.hfc-essentials.com';

	constructor(private readonly username: string, private readonly apiKey: string) {}

	private async fetch<T>(resource: string, extraParams?: Record<string, any>): Promise<T> {
		const url = new URL(resource, Client.API_URL);
		const params = new URLSearchParams({
			...extraParams,
			mode: 'json',
			key: this.apiKey,
			user: this.username,
		});
		url.search = params.toString();

		const response = await fetch(url);
		const data = response.json() as T;
		return data;
	}

	/**
	 * Returns a current top ten list of user names and their scores.
	 */
	topTen(): Promise<any> {
		return this.fetch<RetroAchievementsApiResponses.TopTen>('top_ten.php');
	}

	/**
	 * Returns a list of supported consoles and their Id numbers.
	 */
	consoles(): Promise<any> {
		return this.fetch<RetroAchievementsApiResponses.ConsoleId>('console_id.php');
	}

	/**
	 * Returns a list of supported games and Game Ids for the provided Console Id.
	 */
	games({ consoleId }: { consoleId: number }): Promise<any> {
		return this.fetch<RetroAchievementsApiResponses.GameList>('game_list.php', { console: consoleId });
	}

	/**
	 * Returns the game information for the specified Game ID.
	 */
	game({ gameId }: { gameId: number }): Promise<any> {
		return this.fetch<RetroAchievementsApiResponses.GameInfo>('game_info.php', { game: gameId });
	}

	/**
	 * Returns the game information for the specified Game ID with some extra information, including available achievements.
	 */
	gameExtended({ gameId }: { gameId: number }): Promise<any> {
		return this.fetch('game_info_extended.php', { game: gameId });
	}

	// GAME INFO AND PROGRESS
	// Returns the game information for the specified Game ID with achievement progress information. The default value for the Game ID is 3.
	// REQUIRED VARIABLES: game=Game ID
	// JSON:	https://ra.hfc-essentials.com/game_progress.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&game=3&mode=json

	// USER RANK AND SCORE
	// Returns the specified user's rank and overall score for a specified Game ID. The default value for the User Name is yours, and the default Game ID is 3.
	// REQUIRED VARIABLES: member=User Name
	// JSON:	https://ra.hfc-essentials.com/user_rank.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&game=3&member=Adultery&mode=json

	/**
	 * Returns the specified user's rank and overall score for a specified Game ID. The default value for the User Name is yours.
	 */
	userRank({ username, gameId }: { username?: number; gameId: number }): Promise<any> {
		const member = username ?? this.username;
		return this.fetch('', { member, game: gameId });
	}

	// USER RECENTLY PLAYED GAMES
	// Returns the specified user's recently played game list. The default value for the User Name is yours, and the default result total is 10.
	// REQUIRED VARIABLES: member=User Name; results=Total Results
	// JSON:	https://ra.hfc-essentials.com/user_recent.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&results=10&mode=json

	// USER PROGRESS
	// Returns the progress of a user based on the specified Game ID. The default value for the User Name is yours, and the default game ID is 3.
	// REQUIRED VARIABLES: member=User Name; game=Game ID
	// JSON:	https://ra.hfc-essentials.com/user_progress.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&mode=json

	// USER SUMMARY
	// Returns a summary of recent results for the specified user. The default User Name is yours, and the default number of results is 10.
	// REQUIRED VARIABLES: member=User Name; game=Game ID
	// JSON:	https://ra.hfc-essentials.com/user_summary.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&results=10&mode=json

	// USER COMPLETIONS
	// Returns a list of games that are complete (mastered) or otherwise in progress (or have ever been attempted) by a specified user. The default value for the User Name is yours.
	// REQUIRED VARIABLES: member=User Name
	// JSON:	https://ra.hfc-essentials.com/user_by_date.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&mode=json

	// USER ACHIEVEMENTS BY DATE
	// Returns a summary of last played games for the specified user on the specified date. Dates must be in UNIX format. The default User Name is yours, and the default date is today.
	// REQUIRED VARIABLES: member=User Name; date=Date in UNIX format
	// JSON:	https://ra.hfc-essentials.com/user_by_date.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&date=1681146446&mode=json

	// USER ACHIEVEMENTS BY DATE RANGE
	// Returns a summary of last played games for the specified user on the specified date range. Dates must be in UNIX format. The default User Name is yours, and the default start date is 2 weeks ago, and the default end date is today.
	// REQUIRED VARIABLES: member=User Name; startdate=Start of date range in UNIX format; enddate=End of date range in UNIX format
	// JSON:	https://ra.hfc-essentials.com/user_by_date.php?user=+YOUR_RA_USERNAME+&key=+YOUR_API_KEY+&member=Adultery&startdate=1681146446&enddate=1649610446&mode=json
}
