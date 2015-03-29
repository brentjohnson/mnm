/*
  Assign initial cards to a player.
  	For now, pulls random cards from all cards in all sets (valid for the league)
  	Not sure how to deal with mythics...
  		if all sets have mythics, not a problem, else, problem (Vintage)
  	Probably should chose a random set and then give a whole "pack" from that set
  		then easier to deal with: Either that set has mythics or it doesn't
  	BUT then you get more cards from small expansions in a block.
  		maybe count all the cards from all the sets then use that for % chance to get a pack from that set

  	THS: 249 cards
  	BNG: 165 cards
  	JOU: 165 cards

  	So for this block (579 cards) odd to get a pack from a given set

	THS: 43.0%
	BNG: 28.5%
	JOU: 28.5%

	Implementations: just pick a random card from all cards in the league.  Whatever set
	that card is from... that's the pack.

	db.yourCollection.find().limit(-1).skip(yourRandomNumber).next()
*/
assignCards = function(userId, leagueId) {

    var baseQuery;
    var query;
    var cards;

    // Fetch the league to see what cards to give
    league = Leagues.findOne(leagueId);

    baseQuery = {
        cardSetId: {
            $in: league.sets
        }
    };

    // Gimme some cards
    console.log("Base query: " + baseQuery);

    // Basic land.
    query = _.clone(baseQuery);

    // For each type of land
    _.each(["Forest", "Swamp", "Island", "Plains", "Mountain"], function(cardname) {

        query.name = cardname;
        console.log("Land query:");
        console.log(query);
        // Get array of "Forest"
        cards = Cards.find(query).fetch();
        console.log("Lands found: " + cards.length);
        for (i = 0; i < league.startingbasicland; i++) {

            card = _.omit(Random.choice(cards), "_id");
            console.log("Card: " + card.name + " (" + card.cardSetId + ")");

            card.userId = userId;
            card.leagueId = leagueId;
            card.inDeck = false;

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

    console.log("  Selecting rares from pool of: " + cards.length);

    if (cards.length) {
        for (i = 0; i < league.startingpacks; i++) {

            card = _.omit(Random.choice(cards), "_id");
            console.log("Card: " + card.name + " (" + card.cardSetId + ")");
            card.userId = userId;
            card.leagueId = leagueId;
            card.inDeck = false;

            LeagueCards.insert(card);
        }
    }

    // Get 3 "Uncommon"
    query = _.clone(baseQuery);
    query.rarity = "Uncommon";
    console.log("Uncommon query:");
    console.log(query);
    cards = Cards.find(query).fetch();

    console.log("  Selecting uncommons from pool of: " + cards.length);

    if (cards.length) {
        for (i = 0; i < league.startingpacks * 3; i++) {

            card = _.omit(Random.choice(cards), "_id");
            console.log("Card: " + card.name + " (" + card.cardSetId + ")");

            card.userId = userId;
            card.leagueId = leagueId;
            card.inDeck = false;

            LeagueCards.insert(card);
        }
    }

    // Get 11 "Common"
    query = _.clone(baseQuery);
    query.rarity = "Common";
    console.log("Common query:");
    console.log(query);
    cards = Cards.find(query).fetch();

    console.log("  Selecting commons from pool of: " + cards.length);

    if (cards.length) {
        for (i = 0; i < league.startingpacks * 11; i++) {

            card = _.omit(Random.choice(cards), "_id");
            console.log("Card: " + card.name + " (" + card.cardSetId + ")");

            card.userId = userId;
            card.leagueId = leagueId;
            card.inDeck = false;

            LeagueCards.insert(card);
        }
    }
}