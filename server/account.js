// Support for playing D&D: Roll 3d6 for dexterity
Accounts.onCreateUser(function(options, user) {

  // Gimme some cards
  var card;

  // For each type of land
  _.each(["Forest","Swamp","Island","Plains","Mountain"], function(cardname){

    // Get array of "Forest"
    cards = CardPool.find({name: cardname}).fetch();

    for (i=0; i<30; i++) {

	    card = _.omit(Random.choice(cards), "_id");

	    card.user = user._id;

	    CardCollection.insert(card);
	}

    // 30 x
      // card = Grab a random one
      // card.owner = user.id
      // CardCollection.insert(card)

  });

  // For each set, 1 rare, 3 uncommon, 11 common


  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});