Template.body.helpers({

	 cardpool: function () {
        // Otherwise, return all of the tasks
        return CardCollection.find({user: Meteor.userId()});
    }
});