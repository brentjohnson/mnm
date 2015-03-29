Template.deck.helpers({

    cardpool: function() {
        return LeagueCards.find({
            inDeck: false
        }, {
            sort: {
                name: 1,
                id: 1
            }
        });
    },
    decklist: function() {
        return LeagueCards.find({
            inDeck: true
        }, {
            sort: {
                name: 1,
                id: 1
            }
        });
    },
    decksize: function() {
        return LeagueCards.find({
            inDeck: true
        }).count();
    },
    collectionsize: function() {
        return LeagueCards.find({
            inDeck: false
        }).count();
    },
    leagueId: function() {
        return Session.get('leagueId');
    },
    deckSaved: function() {
        console.log('dsl: ' + Leagues.findOne(Session.get('leagueId')).deckSaveList);

        return _.indexOf(Leagues.findOne(Session.get('leagueId')).deckSaveList, Meteor.userId()) !== -1;
    }
});

Template.deck.events({
    "click #cardcollection .result-row": function() {
        // Set the checked property to the opposite of its current value
        if (_.indexOf(Leagues.findOne(Session.get('leagueId')).deckSaveList, Meteor.userId()) === -1) {
            Meteor.call("cardInDeck", this._id, true);
        } else {
            alert("You can't modify a saved deck.")
        }
    },
    "click #deck .result-row": function() {
        // Set the checked property to the opposite of its current value
        if (_.indexOf(Leagues.findOne(Session.get('leagueId')).deckSaveList, Meteor.userId()) === -1) {
            Meteor.call("cardInDeck", this._id, false);
        } else {
            alert("You can't modify a saved deck.")
        }
    },
    "click .saveDeck": function() {

        if (LeagueCards.find({
                inDeck: true
            }).count() >= 60) {
            Meteor.call('saveDeck', Session.get('leagueId'));
        } else {
            alert('Must have 60 or more cards to save.')
        }
    }

});