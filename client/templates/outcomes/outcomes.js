Template.outcomes.helpers({
    outcome: function(){
        console.log(this.people);
        for (var index in this.people){
            person = this.people[index];
            console.log(person);
            person = People.findOne({_id:person.personId});
            console.log(person);
        }
    }

});
