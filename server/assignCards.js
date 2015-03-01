assignCards = function (userId, leagueId) {

	var baseQuery;
	var query;

	// Fetch the league to see what cards to give
	league = Leagues.find(leagueId).fetch()[0]; 
console.log("Format: "+league.format);
	if (league.format) {
		baseQuery = { 
// $or Restricted!?
			formats: {
				name: league.format,
				legality: 'Legal'
			}
		 };
	} else {
		baseQuery = { cardSetName: {$in: league.sets}};
	}
	// Gimme some cards
console.log("Base query: "+baseQuery);

	// Basic land.
	query = _.clone(baseQuery);

	// For each type of land
	_.each(["Forest","Swamp","Island","Plains","Mountain"], function(cardname){

		query.name = cardname;
console.log("Query: "+query); 
		// Get array of "Forest"
		cards = Cards.find(query).fetch();
console.log("Lands found: "+cards.length);
		for (i=0; i<league.startingbasicland; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}

	});

	// Add one "pack" (1 rare, 3 uncommon, 11 common)

	cards = [];

	// PROBLEM!  Too many mythics in Vintage.

	// Get 1 "Rare" / "Mythic Rare"  (1 in 8 rares is mythic)
/*
	if (Math.random() > 0.9) {
console.log("MYTHIC!");
		query = _.clone(baseQuery);
		query.rarity = "Mythic Rare";
		cards = Cards.find(query).fetch();
	}
*/
	// If we didn't roll a mythic or there are no mythics, get a rare.
	if (cards.length == 0) {
		query = _.clone(baseQuery);
		query.rarity = "Rare";
		cards = Cards.find(query).fetch();
	}

console.log("  Selecting rares from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.strtingpacks; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}

	// Get 3 "Uncommon"
	query = _.clone(baseQuery);
	query.rarity = "Uncommon";
	cards = Cards.find(query).fetch();

console.log("  Selecting uncommons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.strtingpacks*3; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}

	// Get 11 "Common"
	query = _.clone(baseQuery);
	query.rarity = "Common";
	cards = Cards.find(query).fetch();

console.log("  Selecting commons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.strtingpacks*11; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}
}