Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    trackPageView: true,
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

Router.route('/achievements', {
    name: 'achievements',
    data: function(){
        console.log(Meteor.userId());
        return [ {descritpion: 'achievement 1'} ]
    }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {only: 'achievements'});
Router.onBeforeAction('dataNotFound', {only: 'outcomes'});
