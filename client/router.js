Router.map(function() {

	this.route('index', {
		path: '/',
		action: function() {
			if (Meteor.userId()) {
				this.render('deck')
			} else {
				this.render('landing')
			}
		}
	})

});
