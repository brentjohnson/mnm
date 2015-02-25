// Support for playing D&D: Roll 3d6 for dexterity
Accounts.onCreateUser(function(options, user) {

  // Gimme some cards

  // Add 30 of each land.
  // For each type of land
  _.each(["Forest","Swamp","Island","Plains","Mountain"], function(cardname){

    // Get array of "Forest"
    cards = Cards.find({name: cardname, cardSetName: "Limited Edition Alpha"}).fetch();

    for (i=0; i<12; i++) {

	    card = _.omit(Random.choice(cards), "_id");

	    card.user = user._id;

	    LeagueCards.insert(card);
	}

  });

  // Add one "pack" (1 rare, 3 uncommon, 11 common) from each set.

/*	  sets = _.uniq(CardPool.find({}, {fields: {cardSetName: true}
		}).fetch().map(function(x) {
		    return x.cardSetName;
		}), false);
*/

 sets = ["Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha","Limited Edition Alpha"];

  _.each(sets, function(setname){

console.log("Set name:"+setname);

	cards = [];

    // Get 1 "Rare" / "Mythic Rare"  (1 in 8 rares is mythic)
	if (Math.random() > 0.875) {
console.log("MYTHIC!");
		cards = Cards.find({cardSetName: setname, rarity: "Mythic Rare"}).fetch();
	}

	// If we didn't roll a mythic or there are no mythics, get a rare.
    if (cards.length == 0) {
	   cards = Cards.find({cardSetName: setname, rarity: "Rare"}).fetch();
	}

console.log("  Selecting rares from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<1; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.user = user._id;

		    LeagueCards.insert(card);
		}
	}

    // Get 3 "Uncommon"
    cards = Cards.find({cardSetName: setname, rarity: "Uncommon"}).fetch();

console.log("  Selecting uncommons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<3; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.user = user._id;

		    LeagueCards.insert(card);
		}
	}

    // Get 11 "Common"
    cards = Cards.find({cardSetName: setname, rarity: "Common"}).fetch();

console.log("  Selecting commons from pool of: "+cards.length);

	if (cards.length) {
	    for (i=0; i<11; i++) {

		    card = _.omit(Random.choice(cards), "_id");

		    card.user = user._id;

		    LeagueCards.insert(card);
		}
	}

  });



  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});