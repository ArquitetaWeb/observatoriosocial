var AppRouter = Backbone.Router.extend({

    routes: {
        ""                               : "home",
        "about"                          : "about",
		"help"                           : "help",
		"authenticated/:hash/:token"     : "authenticated"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
		this.headerView.selectMenuItem('about-menu');
    },
	
	help: function () {
        if (!this.helpView) {
            this.helpView = new HelpView();
        }
        $('#content').html(this.helpView.el);
		this.headerView.selectMenuItem('help-menu');
    },
	
	authenticated: function (hash, token) {
		var obj = new Auth({_hash: hash, _token: token});
        obj.fetch({
			success: function(){
				$("#content").html(new AuthenticatedView({model: obj}).el);
			}, 
			error: function(e){
				$("#content").html(new ErrorView().el);
			}
		});		
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'AboutView', 'HelpView', 'ErrorView', 'AuthenticatedView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});