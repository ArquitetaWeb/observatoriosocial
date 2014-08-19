var AppRouter = Backbone.Router.extend({

    routes: {
        ""                               : "home",
		"graph/:graph/:parameters"	     : "graph"
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
    },
	
	graph: function (graph, parameters) {
		var obj = new Graph({_graph: graph, _parameters: parameters});
        obj.fetch({
			success: function(){		
				$(".header").hide();
				$(".footer").hide();			
				$("#content").html(new GraphView({model: obj}).el);
			}, 
			error: function(e){
				$("#content").html(new ErrorView().el);
			}
		});		
    }

});

utils.loadTemplate(['HomeView', 'ErrorView', 'GraphView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});