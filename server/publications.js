/*Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});
*/

Meteor.publish('leaguecards', function(leagueId) {
	if (this.userId) {
		console.log('publishing leaguecards');
		return LeagueCards.find({userId: this.userId, leagueId: leagueId});
	}
	console.log('not publishing leaguecards: not signed in?');

});

Meteor.publish('decks', function() {
	if (this.userId) {
		console.log('publishing decks');
		return Decks.find({userId: this.userId});
	}
	console.log('not publishing decks: not signed in?');

});

Meteor.publish('leagues', function() {
	console.log('publishing leagues')
	return Leagues.find({});
});


