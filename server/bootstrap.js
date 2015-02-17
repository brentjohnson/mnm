// if the database is empty on server start, create some sample data.
Meteor.startup(function () {

  if (CardPool.find().count() === 0) {

  	var myjson = JSON.parse(Assets.getText("cards.json"));

    _.each(myjson, function(card) {

      CardPool.insert(card);

    });
  }
});
