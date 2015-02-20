Template.deck.helpers({

	 cardpool: function () {
        // Otherwise, return all of the tasks
        return CardCollection.find({user: Meteor.userId()}, {sort: {name: 1, id: 1}});
    },
    decklist: function () {
    	return DeckCollection.find({user: Meteor.userId()}, {sort: {name: 1, id: 1}});
    },
    decksize: function () {
    	return DeckCollection.find({user: Meteor.userId()}, {sort: {name: 1, id: 1}}).count();
    },
    collectionsize: function () {
    	return CardCollection.find({user: Meteor.userId()}, {sort: {name: 1, id: 1}}).count();
    }
});

Template.deck.events({
    "click #cardcollection .result-row": function () {
      // Set the checked property to the opposite of its current value
      DeckCollection.insert(this);
    },
    "click #deck .result-row": function () {
      // Set the checked property to the opposite of its current value
      DeckCollection.remove(this._id);
    }

});
