Meteor.publish('people', function(){
    return People.find();
});

Meteor.publish('outcomes', function(){
    return Outcomes.find();
});
