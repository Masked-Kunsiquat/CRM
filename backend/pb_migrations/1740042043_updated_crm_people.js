/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4263046007")

  // remove field
  collection.fields.removeById("relation3816207272")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4263046007")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3254374249",
    "hidden": false,
    "id": "relation3816207272",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "contact_info",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
