@AdminConfig = {
    nonAdminRedirectRoute: 'index'
    name: 'kill fuck impeach'
    adminEmails: ['admin@killfuckimpeach.com']
    dashboard:
        homeUrl: '/admin'
    collections: {
        People: {
            tableColumns: [
                {label: 'Image Path', name: 'img_path'}
                {label: 'Name', name: 'name'}
                {label: 'Created At', name: 'createdAt'}
                {label: 'Id', name: '_id'}
            ]
        
        }
        Outcomes: {
            tableColumns: [
                {label: 'Id', name: '_id'}
            ]
        }
    }
}


