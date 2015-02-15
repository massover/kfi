Template.outcomes.helpers({
    people: function(){
        people = this.people
        for (var index in people){
            person = People.findOne({_id: people[index].personId});
            people[index].img_path = person.img_path;
            total_decisions = people[index].kill + 
                              people[index].fuck + 
                              people[index].impeach;
            people[index].kill_percentage = 
                Math.round((people[index].kill / total_decisions) * 100);
            people[index].fuck_percentage = 
                Math.round((people[index].fuck / total_decisions) * 100);
            console.log(people[index].kill_percentage);
            people[index].impeach_percentage = 
                Math.round((people[index].impeach / total_decisions) * 100);
        }
        return people;
    }

});
