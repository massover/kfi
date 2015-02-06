Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('people'); }
});

Router.route('/', {name: 'index'});
Router.route('/results', {name: 'results'});
