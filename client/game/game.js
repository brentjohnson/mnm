Template.game.helpers({

    decklist: function () {
    	return Decks.find({}, {sort: {name: 1, id: 1}});
    }
    
});

Template.game.events({
    "click #cardcollection .result-row": function () {
      // Set the checked property to the opposite of its current value
      Decks.insert(this);
    },
    "click #deck .result-row": function () {
      // Set the checked property to the opposite of its current value
      Decks.remove(this._id);
    }

});
