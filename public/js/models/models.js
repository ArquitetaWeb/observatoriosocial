window.Graph = Backbone.Model.extend({
	urlRoot: "/graph/",
	initialize: function(options) {
		this._parameters = options._parameters;
		this._graph = options._graph;
    },	
	url: function() {
		// send the url along with the serialized query params
		return this.urlRoot + this._graph + "/" +  this._parameters;
	}	
});