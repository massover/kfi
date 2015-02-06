Results = new Mongo.Collection('results');

Meteor.methods({
    resultInsert: function(result){
        console.log('hello world');
        for (var index in result){
            person = result[index];
            console.log(person);
        }
    }
});
