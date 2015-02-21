Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('landing');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});

/*
Router.route('/', function () {
  this.render('deck');
});
*/
Router.route('/', function () {
  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('landing');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.redirect('/deck');
  }
});
Router.route('/landing');
Router.route('/deck');
Router.route('/game');

/*Router.map(function() {


	this.route('index', {
		path: '/',
		action: function() {
			if (!Meteor.userId()) {
				this.render('landing');
			} else {
				this.render();
			}
		}
	})
});
*/
