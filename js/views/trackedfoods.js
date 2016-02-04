// site/js/views/library.js

var app = app || {};

app.TrackedFoodsView = Backbone.View.extend({
    el: '#foods',

    initialize: function() {
        this.$items = this.$el.find('#items');
        this.$totalSumary = this.$el.find('#total-summary');
        this.$trackedItems = this.$el.find('#tracked-items');

        this.total = new app.Item();
        this.total.attributes['name'] = 'Total Summary';
        /*{
            name: 'Total Summary',
            calories: 0,
            totalFat: 0,
            cholesterol: 0,
            sodium: 0,
            protein: 0
        };*/

        this.collection = new app.TrackedFoods();
        this.trackedfoods = new app.TrackedFoods();
        this.trackedfoods.fetch({reset: true});   // NEW

        this.renderTracked();

        this.listenTo( this.collection, 'add', this.renderItem );
        this.listenTo( this.collection, 'reset', this.render ); // NEW
        this.listenTo( this.trackedfoods, 'add', this.renderTrackedItem );
        this.listenTo( this.trackedfoods, 'reset', this.renderTracked ); // NEW
    },

    events:{
        'click #search':'searchItem',
    },

    searchItem: function( e ) {
        e.preventDefault();
        var self = this;

        this.collection.reset();

        var searchUrl = "https://api.nutritionix.com/v1_1/search/" + $('#food').val()
            + "?results=0%3A6&cal_min=0&cal_max=50000&appId=2aecb670&appKey=7dd559cc2170f76eee8063f82cb6b3e4";

        $.getJSON(searchUrl)
             .done(function(json) {
                console.log(json);
                $.each(json.hits, function(i, data) {
                    var itemUrl = "https://api.nutritionix.com/v1_1/item?id=" + data.fields.item_id + "&appId=2aecb670&appKey=7dd559cc2170f76eee8063f82cb6b3e4";
                    $.getJSON(itemUrl)
                        .done(function(item){
                            console.log(item);
                            var food = {};
                            food['name'] = item.item_name;
                            food['calories'] = item.nf_calories;
                            food['totalFat'] = item.nf_total_fat;
                            food['cholesterol'] = item.nf_cholesterol;
                            food['sodium'] = item.nf_sodium;
                            food['protein'] = item.nf_protein;
                            self.collection.add( food );

                        })
                        .error(function() {});
                });
             })
            .error(function() {
                console.log('error result');
            });
    },

    // render tracked-foods by rendering each food in its collection
    render: function() {
        this.$items.html('');
        this.collection.each(function( item ) {
            this.renderItem( item );
        }, this );
    },

    // render tracked-foods by rendering each food in its collection
    renderTracked: function() {
        var self = this;

        this.total.attributes['calories'] = 0;
        this.total.attributes['totalFat'] = 0;
        this.total.attributes['cholesterol'] = 0;
        this.total.attributes['sodium'] = 0;
        this.total.attributes['protein'] = 0;
        console.log(this.total);

        this.trackedfoods.each(function(item) {
            console.log('item', item);
            self.total.attributes['calories'] += item.attributes['calories'];
            self.total.attributes['totalFat'] += item.attributes['totalFat'];
            self.total.attributes['cholesterol'] += item.attributes['cholesterol'];
            self.total.attributes['sodium'] += item.attributes['sodium'];
            self.total.attributes['protein'] += item.attributes['protein'];
        });

        var totalView = new app.ItemView({
            model: this.total,
        });

        this.$totalSumary.html('');
        this.$totalSumary.append( totalView.render().el );

        this.$trackedItems.html('');
        this.trackedfoods.each(function( item ) {
            this.renderTrackedItem( item );
        }, this );
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderItem: function( item ) {
        var itemSelectView = new app.ItemSelectView({
            model: item
        });
        this.$items.append( itemSelectView.render().el );
    },

    renderTrackedItem: function( item ) {
        var itemView = new app.ItemView({
            model: item,
        });
        this.total.attributes['calories'] += item.attributes['calories'];
        this.total.attributes['totalFat'] += item.attributes['totalFat'];
        this.total.attributes['cholesterol'] += item.attributes['cholesterol'];
        this.total.attributes['sodium'] += item.attributes['sodium'];
        this.total.attributes['protein'] += item.attributes['protein'];

        this.$trackedItems.append( itemView.render().el );
    }
});