const leadFields = [
    {
        "name": "leadName",
        "label": "Lead Name",
        "type": "text",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "editable": false,
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
    {
        "name": "leadStatus",
        "label": "Lead Status",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Mixed",
        "isTableField": true,
        "options": [
            {
                "name": "Active",
                "value": "active",
            },
            {
                "name": "Pending",
                "value": "pending",
            },
            {
                "name": "Sold",
                "value": "sold",
            }
        ],
        "validation": [
            {
                "message": "Invalid type value for Lead Status",
                "formikType": "String",
            }
        ],
    },
    {
        "name": "leadEmail",
        "label": "Lead Email",
        "type": "email",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
    {
        "name": "leadPhoneNumber",
        "label": "Lead Phone Number",
        "type": "tel",
        "fixed": true,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [
            {
                "require": true,
                "message": "",
            },
        ],
    },
    {
        "name": "leadAddress",
        "label": "Lead Address",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSource",
        "label": "Lead Source",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSourceDetails",
        "label": "Lead Source Details",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadCampaign",
        "label": "Lead Campaign",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSourceChannel",
        "label": "Lead Source Channel",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSourceMedium",
        "label": "Lead Source Medium",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSourceCampaign",
        "label": "Lead Source Campaign",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadSourceReferral",
        "label": "Lead Source Referral",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadAssignedAgent",
        "label": "Lead Assigned Agent",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadOwner",
        "label": "Lead Owner",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadCreationDate",
        "label": "Lead Creation Date",
        "type": "date",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Date",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadConversionDate",
        "label": "Lead Conversion Date",
        "type": "date",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Date",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadFollowUpDate",
        "label": "Lead Follow Up Date",
        "type": "date",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Date",
        "isTableField": true,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadFollowUpStatus",
        "label": "Lead Follow Up Status",
        "type": "select",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": true,
        "options": [
            {
                "name": "active",
                "value": "active",
            },
            {
                "name": "pending",
                "value": "pending",
            },
            {
                "name": "sold",
                "value": "sold",
            }
        ],
        "validation": [],
    },
    {
        "name": "leadNotes",
        "label": "Lead Notes",
        "type": "textarea",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadCommunicationPreferences",
        "label": "Lead Communication Preferences",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadScore",
        "label": "Lead Score",
        "type": "number",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Number",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadNurturingWorkflow",
        "label": "Lead Nurturing Workflow",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadEngagementLevel",
        "label": "Lead Engagement Level",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadConversionRate",
        "label": "Lead Conversion Rate",
        "type": "number",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "Number",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadNurturingStage",
        "label": "Lead Nurturing Stage",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
    {
        "name": "leadNextAction",
        "label": "Lead Next Action",
        "type": "text",
        "fixed": false,
        "delete": false,
        "belongsTo": null,
        "backendType": "String",
        "isTableField": false,
        "options": [],
        "validation": [],
    },
];

// Export the leadFields object for use in other modules
exports.leadFields = leadFields;
