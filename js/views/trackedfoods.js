// site/js/views/library.js

var app = app || {};

app.TrackedFoodsView = Backbone.View.extend({
    el: '#foods',

    initialize: function() {
        this.$items = this.$el.find('#items');
        this.$totalSumary = this.$el.find('#total-summary');
        this.$trackedItems = this.$el.find('#tracked-items');

        this.total = new app.Item();
        this.total.set({name: 'Total Summary'});

        this.collection = new app.TrackedFoods();
        this.trackedfoods = new app.TrackedFoods();
        this.trackedfoods.fetch({reset: true});   // NEW

        this.renderTotal();
        this.renderTracked();

        this.listenTo( this.collection, 'add', this.renderItem );
        this.listenTo( this.collection, 'reset', this.render ); // NEW
        this.listenTo( this.trackedfoods, 'add', this.renderTrackedItem );
        this.listenTo( this.trackedfoods, 'reset', this.renderTracked ); // NEW
        this.listenTo( this.trackedfoods, 'reset', this.renderTotal ); // NEW
        this.listenTo( this.trackedfoods, 'add', this.renderTotal ); // NEW
        this.listenTo( this.trackedfoods, 'remove', this.renderTotal ); // NEW
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

        this.$trackedItems.append( itemView.render().el );
    },

    renderTotal: function() {
        var data = {calories:0, totalFat:0, cholesterol:0, sodium:0, protein:0};

        this.trackedfoods.each(function(item) {
            data['calories'] += item.get('calories');
            data['totalFat'] += item.get('totalFat');
            data['cholesterol'] += item.get('cholesterol');
            data['sodium'] += item.get('sodium');
            data['protein'] += item.get('protein');
        });

        this.round2Nutrtion(data);

        this.total.set(data);
        var totalView = new app.TotalView({
            model: this.total,
        });

        this.$totalSumary.html('');
        this.$totalSumary.append( totalView.render().el );
    },

    round2Nutrtion: function(data) {
        function round2(x) {
            return Math.round(x*100)/100;
        }

        _.each(data, function(value, key, obj){
            obj[key] = round2(value);
        });
    }
});