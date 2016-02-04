// site/js/models/book.js

var app = app || {};

app.Item = Backbone.Model.extend({
    defaults: {
        name: 'bread',
        calories: 0,
        totalFat: 0,
        cholesterol: 0,
        sodium: 0,
        protein: 0
    }
});