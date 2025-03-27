/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_89547554")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json754145948",
    "maxSize": 0,
    "name": "visited_floors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_89547554")

  // remove field
  collection.fields.removeById("json754145948")

  return app.save(collection)
})
