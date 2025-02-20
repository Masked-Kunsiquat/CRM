/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_4263046007",
        "hidden": false,
        "id": "relation561756999",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "person_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_82gE",
        "max": 0,
        "min": 0,
        "name": "full_name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_bUNv",
        "maxSelect": 3,
        "name": "relationship",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "friend",
          "family",
          "collegue"
        ]
      },
      {
        "hidden": false,
        "id": "json2008777387",
        "maxSize": 1,
        "name": "last_interaction",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3332258600",
        "maxSize": 1,
        "name": "upcoming_event",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_3596900492",
    "indexes": [],
    "listRule": "",
    "name": "crm_people_summary",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER()) AS id,  -- Unique ID required by PocketBase\n    p.id AS person_id,\n    p.full_name,\n    p.relationship,\n    (SELECT i.interaction_date \n     FROM crm_recent_interactions i\n     WHERE i.person_id = p.id\n     ORDER BY i.interaction_date DESC\n     LIMIT 1) AS last_interaction,\n    (SELECT e.date \n     FROM crm_events e\n     WHERE e.person_id = p.id\n     AND e.date >= CURRENT_DATE\n     ORDER BY e.date ASC\n     LIMIT 1) AS upcoming_event\nFROM crm_people p;\n",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3596900492");

  return app.delete(collection);
})
