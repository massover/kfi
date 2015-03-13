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

var goToAdmin = function() {
  if (Meteor.user()) {
    Router.go('adminDashboard');
    this.next();
  }
  else{
    this.next();
  }
};

Router.onBeforeAction(goToAdmin, {only: ['index', 'outcomes']});
Router.onBeforeAction('dataNotFound', {only: 'outcomes'});
