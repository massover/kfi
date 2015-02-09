Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { 
        return [ Meteor.subscribe('people'), Meteor.subscribe('outcomes') ]; 
    }
});

Router.route('/', {name: 'index'});
Router.route('/outcomes', {name: 'outcomes'});
