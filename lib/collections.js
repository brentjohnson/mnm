// Sets - set descriptions
// Cards - card descriptions
// Leagues - league instances
// LeagueCards - cards a player owns in a league
// Decks - decks
// Games - game

Sets = new Meteor.Collection('sets');

Cards = new Meteor.Collection('cards');

Leagues = new Meteor.Collection('leagues');

LeagueCards = new Meteor.Collection('leaguecards');

Decks = new Meteor.Collection('decks');

Games = new Meteor.Collection('games');


if (Meteor.isClient) {
	Meteor.subscribe("leagues");
	Meteor.subscribe("decks");
}