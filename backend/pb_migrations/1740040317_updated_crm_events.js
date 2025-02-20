/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2240402971")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4263046007",
    "hidden": false,
    "id": "relation561756999",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "person_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "birthday",
      "anniversary",
      "death",
      "custom"
    ]
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2240402971")

  // remove field
  collection.fields.removeById("relation561756999")

  // remove field
  collection.fields.removeById("select2363381545")

  // remove field
  collection.fields.removeById("date2862495610")

  // remove field
  collection.fields.removeById("text18589324")

  return app.save(collection)
})
