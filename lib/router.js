Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { 
        return [Meteor.subscribe('people'), Meteor.subscribe('outcomes')]; 
    }
});

Router.route('/', {name: 'index'});
Router.route('/outcomes/:_id', {
    name: 'outcomes',
    data: function() {
        return Outcomes.findOne(this.params._id);
    }
});

Router.onBeforeAction('dataNotFound', {only: 'outcomes'});
