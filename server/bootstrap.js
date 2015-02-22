CardPool = new Meteor.Collection('cardpool');

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {

  if (CardPool.find().count() === 0) {
/*
  	var myjson = JSON.parse(Assets.getText("cards.json"));

    _.each(myjson, function(card) {

      CardPool.insert(card);

    });
 */

	var seturl = "http://api.mtgdb.info/sets/";

	//synchronous GET
	var result = Meteor.http.get(seturl, {timeout:30000});

	if(result.statusCode==200) {
		var sets = JSON.parse(result.content);
		console.log("response received.");

		// Override for now
		_.each(sets, function(set) {

			if (set.type == "Core" || set.type == "Expansion") {

				console.log("Loading: "+set.name);

				CardSet.insert(set);

				cardsurl = "http://api.mtgdb.info/cards/?fields=id,name,cardSetName,type,rarity&cardSetName="+set.name;

				var cardsresult = Meteor.http.get(cardsurl, {timeout:30000});

				var cards = JSON.parse(cardsresult.content);

				_.each( cards, function(card) {
				      CardPool.insert(card);
				});

			}

		});



	} else {
		console.log("Response issue: ", result.statusCode);
		var errorJson = JSON.parse(result.content);
		throw new Meteor.Error(result.statusCode, errorJson.error);
	}

  }
});
