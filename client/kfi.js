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
    dropzoneLabel = event.target.parentNode.childNodes[3];
    dropzoneLabel.textContent = event.target.getAttribute('id');

  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.draggable.snap(false);
    event.target.classList.remove('dropzone-targeted');
    event.target.textContent = event.target.getAttribute('id');
    dropzoneLabel = event.target.parentNode.childNodes[3];
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
        console.log('done');
    };
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('dropzone-active');
    event.target.classList.remove('dropzone-targeted');
  }

});

$(function() {
    $('img').mousedown(function(){
        $('img').css('z-index','1');
        $(this).css('z-index','2');
        dropzoneId = $(this).attr('in-dropzone');
        if (typeof dropzoneId !== typeof undefined && dropzoneId !== false) {
            $(this).removeAttr('in-dropzone');
            $('#' + dropzoneId).removeAttr('blocked');
        }
    });

});
