// site/js/views/book.js

var app = app || {};

app.ItemSelectView = Backbone.View.extend({
    tagName: 'div',
    className: 'itemContainer',
    template: _.template( $( '#itemSelectTemplate' ).html() ),

    events: {
        'click .select': 'selectItem'
    },

    selectItem: function() {
        //Select model
        appViews.trackedfoods.create(this.model);
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.attributes ) );

        return this;
    }
});

app.ItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'itemContainer',
    template: _.template( $( '#itemTemplate' ).html() ),

    events: {
        'click .delete': 'deleteItem',
    },

    deleteItem: function() {
        //Delete model
        this.model.destroy();
        console.log(appViews.trackedfoods);
        appViews.trackedfoods.remove(this.model);
        console.log(appViews.trackedfoods);
        //Delete view
        this.remove();
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.attributes ) );

        return this;
    }
});

app.TotalView = Backbone.View.extend({
    tagName: 'div',
    className: 'totalContainer',
    template: _.template( $( '#totalTemplate' ).html() ),

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.attributes ) );

        return this;
    }
});