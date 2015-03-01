Template.leagueList.helpers({

    myLeagues: function () {
        return Leagues.find({players: Meteor.userId()});
    },
    availableLeagues: function () {
    	return Leagues.find({players: {$ne: Meteor.userId()}});
    }
});

Template._availableLeague.events({
	"click .join": function () {

		Meteor.call('joinLeague', this._id);

//		this.players.push(Meteor.userId());
//		Leagues.update(this._id,{$set: {players: this.players}});
    }
})