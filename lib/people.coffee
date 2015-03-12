@Schemas = {}
Schemas.People = new SimpleSchema
    img_path:
        type: String
    name:
        type: String
    createdAt:
        type: Date
        label: 'Date'
        autoValue: ->
            if this.isInsert
                return new Date()

@People = new Mongo.Collection('people')
People.attachSchema(Schemas.People)
        


