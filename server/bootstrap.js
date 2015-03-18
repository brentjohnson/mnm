
// if the database is empty on server start, create some sample data.
Meteor.startup(function () {

  if (Cards.find().count() === 0) {

	var seturl = "http://api.mtgdb.info/sets/";

	//synchronous GET
	var result = Meteor.http.get(seturl, {timeout:30000});

	if(result.statusCode==200) {
		var sets = JSON.parse(result.content);

		// Override for now
		_.each(sets, function(set) {

			if (set.type == "Core" || set.type == "Expansion") {

				console.log("Loading: "+set.name);

				Sets.insert(set);

//				cardsurl = "http://api.mtgdb.info/cards/?fields=id,name,cardSetName,type,rarity&cardSetName="+set.name;
				cardsurl = "http://api.mtgdb.info/cards/?cardSetName="+set.name;

				var cardsresult = Meteor.http.get(cardsurl, {timeout:30000});

				var cards = JSON.parse(cardsresult.content);

				_.each( cards, function(card) {
				      Cards.insert(card);
				});

			}

		});



	} else {
		console.log("Response issue: ", result.statusCode);
		var errorJson = JSON.parse(result.content);
		throw new Meteor.Error(result.statusCode, errorJson.error);
	}

  }

  if (Leagues.find().count() === 0) {
 
 	console.log('Inserting leagues');

  	Leagues.insert({
  		name: 'In The Beginning... (Alpha only)',
  		players: [],
  		round: 0,
		sets: ['LEA'],
		startingpacks: 12,
		startingbasicland: 12,  
		ante: false,
		startdate: Date.now(),
		status: 'recruiting'
  	});

	Leagues.insert({
  		name: 'Standardized Testing (Standard)',
  		players: [],
  		round: 0,
		sets: ['M15', 'THS', 'BNG', 'JOU', 'KTK', 'FRF', 'DTK'],
		startingpacks: 36,
		startingbasicland: 12,  
		ante: false,
		startdate: Date.now(),
		status: 'recruiting'
  	});

/* Doesn't work yet.

	Leagues.insert({
  		name: 'Anything Goes! (Vintage)',
  		players: [],
  		round: 0,
		sets: [],
		startingpacks: 72,
		startingbasicland: 12,  
		ante: false,
		startdate: Date.now(),
		status: 'recruiting'
  	});
*/
	Leagues.insert({
  		name: 'First Visit to Ravnica (Ravnica Block)',
  		players: [],
  		round: 0,
		sets: ['RAV', 'GPT', 'DIS'],
		startingpacks: 36,
		startingbasicland: 12,  
		ante: false,
		startdate: Date.now(),
		status: 'recruiting'
  	});
  }
});
