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
        "collectionId": "pbc_1896089724",
        "hidden": false,
        "id": "relation2288905871",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "interaction_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_4263046007",
        "hidden": false,
        "id": "_clone_pMcu",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "person_id",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_UdkQ",
        "maxSelect": 1,
        "name": "interaction_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "call",
          "message",
          "meetup",
          "other"
        ]
      },
      {
        "hidden": false,
        "id": "_clone_MQQw",
        "max": "",
        "min": "",
        "name": "interaction_date",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      }
    ],
    "id": "pbc_1015654015",
    "indexes": [],
    "listRule": "",
    "name": "crm_recent_interactions",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER(PARTITION BY person_id ORDER BY date DESC)) AS id,\n    t1.id AS interaction_id,\n    t1.person_id,\n    t1.interaction_type,\n    t1.date AS interaction_date\nFROM crm_interactions t1\nWHERE (\n    SELECT COUNT(*)\n    FROM crm_interactions t2\n    WHERE t2.person_id = t1.person_id\n    AND t2.date >= t1.date\n) <= 3\nORDER BY t1.person_id, t1.date DESC;\n",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1015654015");

  return app.delete(collection);
})
