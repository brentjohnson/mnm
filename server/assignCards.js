assignCards = function (userId, leagueId) {

	var baseQuery;
	var query;
	var cards;

	// Fetch the league to see what cards to give
	league = Leagues.find(leagueId).fetch()[0]; 

	baseQuery = { cardSetId: {$in: league.sets}};

	// Gimme some cards
console.log("Base query: "+baseQuery);

	// Basic land.
	query = _.clone(baseQuery);

	// For each type of land
	_.each(["Forest","Swamp","Island","Plains","Mountain"], function(cardname){

		query.name = cardname;
console.log("Land query:");
console.log(query); 
		// Get array of "Forest"
		cards = Cards.find(query).fetch();
console.log("Lands found: "+cards.length);
		for (i=0; i<league.startingbasicland; i++) {

		    card = _.omit(Random.choice(cards), "_id");
console.log("Card: "+card.name+" ("+card.cardSetId+")");

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
console.log("Rare query:");
console.log(query); 
		cards = Cards.find(query).fetch();
	}

console.log("  Selecting rares from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.startingpacks; i++) {

		    card = _.omit(Random.choice(cards), "_id");
console.log("Card: "+card.name+" ("+card.cardSetId+")");
		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}

	// Get 3 "Uncommon"
	query = _.clone(baseQuery);
	query.rarity = "Uncommon";
console.log("Uncommon query:");
console.log(query); 
	cards = Cards.find(query).fetch();

console.log("  Selecting uncommons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.startingpacks*3; i++) {

		    card = _.omit(Random.choice(cards), "_id");
console.log("Card: "+card.name+" ("+card.cardSetId+")");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}

	// Get 11 "Common"
	query = _.clone(baseQuery);
	query.rarity = "Common";
console.log("Common query:");
console.log(query); 
	cards = Cards.find(query).fetch();

console.log("  Selecting commons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<league.startingpacks*11; i++) {

		    card = _.omit(Random.choice(cards), "_id");
console.log("Card: "+card.name+" ("+card.cardSetId+")");

		    card.userId = userId;
		    card.leagueId = leagueId;

		    LeagueCards.insert(card);
		}
	}
}