/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407585363")

  // update field
  collection.fields.addAt(2, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407585363")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4263046007",
    "hidden": false,
    "id": "relation561756999",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "person_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
