// site/js/collections/library.js

var app = app || {};

app.TrackedFoods = Backbone.Collection.extend({
    model: app.Item,

	// Save all of the todo items under the `"todos"` namespace.
	localStorage: new Backbone.LocalStorage('items-backbone')

});