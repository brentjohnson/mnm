Template.deck.helpers({

    cardpool: function () {
        return LeagueCards.find({userId: Meteor.userId()}, {sort: {name: 1, id: 1}});
    },
    decklist: function () {
    	return Decks.find({userId: Meteor.userId()}, {sort: {name: 1, id: 1}});
    },
    decksize: function () {
    	return Decks.find({userId: Meteor.userId()}, {sort: {name: 1, id: 1}}).count();
    },
    collectionsize: function () {
    	return LeagueCards.find({userId: Meteor.userId()}, {sort: {name: 1, id: 1}}).count();
    }
});

Template.deck.events({
    "click #cardcollection .result-row": function () {
      // Set the checked property to the opposite of its current value
      Decks.insert(this);
      LeagueCards.remove(this._id);
    },
    "click #deck .result-row": function () {
      // Set the checked property to the opposite of its current value
      Decks.remove(this._id);
      LeagueCards.insert(this)
    }

});
