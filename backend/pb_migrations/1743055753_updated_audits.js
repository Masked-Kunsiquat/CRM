/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_89547554")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number848901969",
    "max": 100,
    "min": null,
    "name": "score",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_89547554")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number848901969",
    "max": null,
    "min": null,
    "name": "score",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
