Template.outcomes.helpers({
    people: function(){
        people = [];
        order = ['kill', 'fuck', 'impeach'];
        for (var index in order){
            decision = order[index];
            for (var index in this.people) {
                person = this.people[index];
                if (person.decision == decision){
                    people.push(person);
                }
            }
        }
        var counts = {};
        for (var index in people){
            person = People.findOne({_id: people[index].personId});
            people[index].name = person.name;
            people[index].img_path = person.img_path;
            people[index].kill_count = 0;
            people[index].fuck_count = 0;
            people[index].impeach_count = 0;
        }
        var query = { $and : [] };
        for (var index in people){
            query.$and.push({
                people: {
                    $elemMatch: {
                        personId: people[index].personId
                    }
                }
            });
        }
        var outcomes = Outcomes.find(query);
       
        var counts = {};
        for (var index in people) {
            counts[people[index].personId] = {
                kill_count: 0,
                fuck_count: 0,
                impeach_count: 0
            };
        }
        outcomes.forEach( function(outcome) {
            for (var index in outcome.people) {
                if (outcome.people[index].decision == 'kill') {
                    counts[outcome.people[index].personId].kill_count++;
                }
                if (outcome.people[index].decision == 'fuck') {
                    counts[outcome.people[index].personId].fuck_count++;
                }
                if (outcome.people[index].decision == 'impeach') {
                    counts[outcome.people[index].personId].impeach_count++;
                }
            }
        });
        var total_outcomes = outcomes.count();
        for (var index in people) {
            person = people[index];
            kill_percentage = Math.floor(
                (counts[person.personId].kill_count / total_outcomes) * 100
            );
            fuck_percentage = Math.floor(
                (counts[person.personId].fuck_count / total_outcomes) * 100
            );
            impeach_percentage = Math.floor(
                (counts[person.personId].impeach_count / total_outcomes) * 100
            );
            people[index] = _.extend(person, {
                kill_percentage: kill_percentage,
                fuck_percentage: fuck_percentage,
                impeach_percentage: impeach_percentage
            });

        }
        return people;
    }

});

