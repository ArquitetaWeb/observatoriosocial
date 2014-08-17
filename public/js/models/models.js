window.Auth = Backbone.Model.extend({
	urlRoot: "/authenticated/",
	initialize: function(options) {
		this._hash = options._hash;
		this._token = options._token;
    },	
	url: function() {
		// send the url along with the serialized query params
		return this.urlRoot + this._hash + "/" + this._token;
	}	
});

window.Graph = Backbone.Model.extend({
	urlRoot: "/graph/",
	initialize: function(options) {
		this._parameters = options._parameters;
    },	
	url: function() {
		// send the url along with the serialized query params
		return this.urlRoot + this._parameters;
	}	
});