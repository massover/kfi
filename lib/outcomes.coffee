@Schemas = {}
Schemas.Outcomes = new SimpleSchema
    people:
        type: [Object]
    "people.$.decision":
        type: String
        regEx: /kill|fuck|impeach/
    "people.$.personId":
        type: String
        regEx: SimpleSchema.RegEx.Id

@Outcomes = new Mongo.Collection('outcomes')
Outcomes.attachSchema(Schemas.Outcomes)

Meteor.methods
    outcomeInsert: (outcome) ->
        outcomeId = Outcomes.insert(outcome)
        return _id: outcomeId

