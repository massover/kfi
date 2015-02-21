Outcomes = new Mongo.Collection('outcomes');

Meteor.methods({
    outcomeInsert: function(outcome){
        var outcomeId = Outcomes.insert(outcome);
        return { 
            _id: outcomeId
        };
    }
});
