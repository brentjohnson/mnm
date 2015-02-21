Template.game.helpers({

    decklist: function () {
    	return DeckCollection.find({user: Meteor.userId()}, {sort: {name: 1, id: 1}});
    }
    
});

Template.game.events({
    "click #cardcollection .result-row": function () {
      // Set the checked property to the opposite of its current value
      DeckCollection.insert(this);
    },
    "click #deck .result-row": function () {
      // Set the checked property to the opposite of its current value
      DeckCollection.remove(this._id);
    }

});
