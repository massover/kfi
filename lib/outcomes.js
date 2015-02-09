Outcomes = new Mongo.Collection('outcomes');

Meteor.methods({
    outcomeInsert: function(people){
        var outcome = {
            people: [
                {
                    personId: people[0]._id,
                    kill: 0,
                    fuck: 0,
                    impeach: 0,
                },{
                    personId: people[1]._id,
                    kill: 0,
                    fuck: 0,
                    impeach: 0,
                },{
                    personId:'obama',
                    kill: 0,
                    fuck: 0,
                    impeach: 0,
                }               
            
            ]
        };
        Outcomes.insert(outcome);
    },
    outcomeUpdate: function(people, outcomeId){
        for (var index in people){
            person = people[index];
            var rule = {};
            rule["people.$."+person.decision] = 1;
            var inc = {$inc: rule};
            Outcomes.update(
                {_id: outcomeId, "people.personId": person.personId},
                inc
            );
        }
        outcome = Outcomes.findOne({_id: outcomeId});
        console.log(outcome);
    }
});
