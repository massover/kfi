Template.index.helpers({
    people : function() {
        return getPeople();
    },
    
});

function getPeople() {
    var count = People.find().count();
    var obama = People.findOne({name: 'Barack Obama'});
    var random_index = Math.floor(Math.random() * (count-1));
    var first_random_person = People.findOne(
        {_id: {$ne: obama._id}},
        {skip:random_index}
    );
    random_index = Math.floor(Math.random() * (count-2));
    var second_random_person = People.findOne(
        {_id: {$nin: [obama._id,first_random_person._id]}},
        {skip:random_index}
    );
    return [
        first_random_person, 
        second_random_person, 
        obama, 
    ];
}

function getOutcome() {
    var outcome = { people: [] };
    var selects = document.getElementsByTagName('select');
    for (var i=0; i<selects.length; i++){
        select = selects[i];
        personId = select.getAttribute('data-personId');
        option = select.options[select.selectedIndex];
        decision = option.getAttribute('data-decision');
        outcome.people.push({
            personId: personId, 
            decision: decision,
        });
    }
    return outcome;
}


Template.index.events({
    "submit form": function (event){
        event.preventDefault();
        var outcome = getOutcome();
        if (outcome.people[0].decision == outcome.people[1].decision ||
            outcome.people[0].decision == outcome.people[2].decision ||
            outcome.people[1].decision == outcome.people[2].decision){
            return alert('Please enter unique decisions for all people');
        }
        Meteor.call('outcomeInsert', outcome, function(error,result){
            if (error)
                return alert('Error writing into the database, please try again');
            Router.go('outcomes',{_id: result._id});
        });
    }
});


