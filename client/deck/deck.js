Template.deck.helpers({

    cardpool: function () {
        return LeagueCards.find({
            inDeck: false
        }, {sort: {name: 1, id: 1}});
    },
    decklist: function () {
        return LeagueCards.find({
            inDeck: true
        }, {sort: {name: 1, id: 1}});
    },
    decksize: function () {
        return LeagueCards.find({
            inDeck: true
        }).count();
    },
    collectionsize: function () {
        return LeagueCards.find({
            inDeck: false
        }).count();
    },
    leagueId: function () {
      return Session.get('leagueId');
    }
});

Template.deck.events({
    "click #cardcollection .result-row": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("cardInDeck", this._id, true);
    },
    "click #deck .result-row": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("cardInDeck", this._id, false);
    }

});
