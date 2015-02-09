function getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max-1) - min + 1)) + min;
}


function getTwoRandomPeople() {
    cursor = People.find(); 
    num_people = cursor.count();
    first_random_number = getRandomInt(0, num_people);
    second_random_number = getRandomInt(0, num_people);
    while (first_random_number == second_random_number){
        second_random_number = getRandomInt(0, num_people);
    } 
    people = cursor.fetch();
    return [ 
        people[first_random_number], 
        people[second_random_number] 
    ];
}

function findOrInsertOutcome(people){
    var outcome = Outcomes.findOne({
        $and : [{
            people: {
                $elemMatch: {
                    personId: 'obama'
                }
            }
        },{
            people: {
                $elemMatch: {
                    personId: people[0]._id
                }
            }
        },{
            people: {
                $elemMatch: {
                    personId: people[1]._id
                }
            }
        }]
    });
    if (!outcome){
        Meteor.call('outcomeInsert', people, function(error, outcome){
            if (error)
                return alert(error.reason);
            var outcome = outcome;
        });
    }
    return outcome;

}

// Ideally I want to do something like this
Template.index.helpers({
    data : function(){
        people = getTwoRandomPeople();
        outcome = findOrInsertOutcome(people);
        return {people:people, outcome:outcome};
    }
    
});


function getResultAndAddToDB(){
    var people = [];
    outcomeId = $('input').val();
    console.log(outcomeId);
    $('img[in-dropzone]').each(function(){
        decision = $(this).attr('in-dropzone');
        name = $(this).attr('data-name');
        personId = $(this).attr('data-personId');
        people.push({
            personId: personId, 
            name: name,
            decision: decision,
        });
    });
    Meteor.call('outcomeUpdate', people, outcomeId, function(error){
        if (error)
            return alert(error.message);
    });
    
}

Template.index.rendered = function() {
    $('img').mousedown(function(){
        $('img').css('z-index','1');
        $(this).css('z-index','2');
        dropzoneId = $(this).attr('in-dropzone');
        if (typeof dropzoneId !== typeof undefined && dropzoneId !== false) {
            $(this).removeAttr('in-dropzone');
            $('#' + dropzoneId).removeAttr('blocked');

        }
    });

    // target elements with the "draggable" class 
    interact('.draggable')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: '.content',
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
    
        // call this function on every dragmove event
        onmove: function (event) {
          var target = event.target,
              // keep the dragged position in the data-x/data-y attributes
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
          // translate the element
          target.style.webkitTransform =
          target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
    
          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      });
    
    
    interact('.draggable').snap({
          mode: 'anchor',
          anchors: [],
          range: Infinity,
          elementOrigin: { x: 0.5, y: 0.5 },
          endOnly: true
    });
    
    interact('.dropzone:not([blocked])').dropzone({
      // only accept elements matching this CSS selector
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.40,
    
      // listen for drop related events:
      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('dropzone-active');
      },
      ondragenter: function (event) {
        // feedback the possibility of a drop
        event.target.classList.add('dropzone-targeted');
        var dropRect = interact.getElementRect(event.target),
            dropCenter = {
              x: dropRect.left + dropRect.width  / 2,
              y: dropRect.top  + dropRect.height / 2
            };
    
        event.draggable.snap({
          anchors: [ dropCenter ]
        });
        event.target.textContent = '';
        dropzoneLabel = event.target.parentNode.childNodes[1];
        choice = event.target.getAttribute('id');
        dropzoneLabel.textContent = choice;
        event.relatedTarget.setAttribute('choice',choice);
    
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.draggable.snap(false);
        event.target.classList.remove('dropzone-targeted');
        event.target.textContent = event.target.getAttribute('id');
        dropzoneLabel = event.target.parentNode.childNodes[1];
        dropzoneLabel.textContent = '\xA0';
    
      },
      ondrop: function (event) {
        event.target.setAttribute('blocked', '');
        dropzoneId = event.target.getAttribute('id');
        event.relatedTarget.setAttribute('in-dropzone',dropzoneId);
        event.draggable.snap({
          anchors: []
        });
        if ($('img[in-dropzone]').length == 3){
            getResultAndAddToDB();
        };
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('dropzone-active');
        event.target.classList.remove('dropzone-targeted');
      }
    
    });
};

