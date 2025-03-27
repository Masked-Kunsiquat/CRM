/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3302821129",
    "max": null,
    "min": null,
    "name": "floors_min",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number4174393936",
    "max": null,
    "min": null,
    "name": "floors_max",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "json1462258971",
    "maxSize": 0,
    "name": "excluded_floors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // remove field
  collection.fields.removeById("number3302821129")

  // remove field
  collection.fields.removeById("number4174393936")

  // remove field
  collection.fields.removeById("json1462258971")

  return app.save(collection)
})
