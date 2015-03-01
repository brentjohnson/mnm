Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.userId() && Router.current().location.get().path !== '/') {
    // if the user is not logged in, render the Login template
    this.redirect('/');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});

Router.map(function(){
  
  this.route('/', function () {
    if (!Meteor.userId()) {
      // if the user is not logged in, render the Login template
      this.render('landing');
    } else {
      this.render('leagueList');
    }
  });

  this.route('/landing');
  this.route('deck', {
    path: '/deck/:leagueId',
    data: function(){
      Session.set('leagueId', this.params.leagueId);
    }
  });
  this.route('/game', {
    path: '/game/:leagueId',
    data: function() {
      Session.set('leagueId', this.params.leagueId);
    }
  });
  this.route('/league/:id');

});
