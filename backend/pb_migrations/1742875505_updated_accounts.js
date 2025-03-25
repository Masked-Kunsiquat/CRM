/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select645904403",
    "maxSelect": 1,
    "name": "frequency",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "monthly",
      "bi-monthly",
      "quarterly",
      "trianually"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date2502384312",
    "max": "",
    "min": "",
    "name": "start_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // remove field
  collection.fields.removeById("select645904403")

  // remove field
  collection.fields.removeById("date2502384312")

  return app.save(collection)
})
