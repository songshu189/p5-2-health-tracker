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

        //Delete view
        this.remove();
    },

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.attributes ) );

        return this;
    }
});