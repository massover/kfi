Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-view-achievements': function(event) {
        event.stopPropagation();
        Template._loginButtons.toggleDropdown();
        Router.go('achievements');
    }
});
