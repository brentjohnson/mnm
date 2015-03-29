

Meteor.publish('leaguecards', function(leagueId) {
	if (this.userId) {
		console.log('publishing leaguecards');
		return LeagueCards.find({userId: this.userId, leagueId: leagueId});
	}
	console.log('not publishing leaguecards: not signed in?');

});


Meteor.publish('leagues', function() {
	console.log('publishing leagues')
	return Leagues.find({});
});


