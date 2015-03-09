Meteor.methods({
  joinLeague: function (leagueId) {

  	var league;

  	// signed in
  	if (!Meteor.userId()) {
  		throw new Meteor.Error("not-signed-in", "User not signed in.");
  	}
  	// passed a leagueId
  	check(leagueId, String);

    // league exists
    league = Leagues.find(leagueId).fetch()[0];

    if (!league) {
      throw new Meteor.Error("not-found", "League ID not found.");
    }

  	// not a member of the league
  	if (_.indexOf(league.players, Meteor.userId()) !== -1) {
      throw new Meteor.Error("already-a-member", "Current user is already a member of this league.");
  	}

  	// league not full
  	if (league.players.length >= 8) {
      throw new Meteor.Error("league-full", "League is full.");
  	}

  	// add to league
  	league.players.push(Meteor.userId());
    Leagues.update(league._id, {$set: {players: league.players}});

  	// assign cards
  	assignCards(Meteor.userId(), leagueId);

    return "some return value";
  }

});

