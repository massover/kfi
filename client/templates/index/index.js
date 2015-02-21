Template.index.helpers({
    data : function() {
        return getData();
    },
    
});

function getData() {
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
        _.extend(first_random_person, {choice:'kill'}),
        _.extend(second_random_person, {choice: 'fuck'}),
        _.extend(obama, {choice: 'impeach'})
    ];
}

function findOrInsertOutcome(people){
    var query = { $and : [] };
    for (var index in people){
        person = people[index];
        query.$and.push({
            people: {
                $elemMatch: {
                    personId: person._id
                }
            }
        });
    }
    var outcome = Outcomes.findOne(query);
    if (!outcome){ 
        Meteor.call('outcomeInsert', people, function(error, outcome){
            if (error)
                Router.go('index');
            var outcome = outcome;
        });
    }
    return outcome;

}

function getOutcome() {
    var outcome = { people: [] };
    $('img[in-dropzone]').each(function(){
        decision = $(this).attr('in-dropzone');
        personId = $(this).attr('data-personId');
        outcome.people.push({
            personId: personId, 
            decision: decision,
        });
    });
    return outcome;
}

Template.index.events({
    "mousedown img": function (event) {
        $('img').css('z-index','1');
        img = event.target;
        img.style.zIndex = 2;
        dropzoneId = img.getAttribute('in-dropzone');
        if (dropzoneId){
            img.removeAttribute('in-dropzone');
            document.getElementById(dropzoneId).removeAttribute('blocked');
        }
    },

    "submit form": function (event){
        event.preventDefault();
        if ($('img[in-dropzone]').length != 3){
            return alert('Please drag all images into dropzones');
        }
        var outcome = getOutcome();
        Meteor.call('outcomeInsert', outcome, function(error,result){
            if (error)
                return alert('Error writing into the database, please try again');
            Router.go('outcomes',{_id: result._id});
        });
    }
});

Template.index.rendered = function() {
    interact('.draggable').draggable({
        inertia: true,
        restrict: {
          restriction: '.content',
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
    
        onmove: function (event) {
          var target = event.target,
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
          target.style.webkitTransform =
          target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
    
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
      overlap: 0.40,
      ondropactivate: function (event) {
        event.target.classList.add('dropzone-active');
      },
      ondragenter: function (event) {
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
      },
      ondropdeactivate: function (event) {
        event.target.classList.remove('dropzone-active');
        event.target.classList.remove('dropzone-targeted');
      }
    
    });
};

