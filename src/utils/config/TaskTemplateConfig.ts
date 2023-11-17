//Generated by WriteToModelconfig_ts - ModelConfig.ts
import { ModelConfig } from "@/interfaces/ModelConfig";

export const TaskTemplateConfig: ModelConfig = {
    //Generated by GetSeqmodelkeys
seqModelID: 91,
modelName: "TaskTemplate",
tableName: "task_templates",
timestamps: false,
pluralizedModelName: "TaskTemplates",
modelPath: "task-templates",
variableName: "taskTemplate",
isMainQuery: true,
sortString: "id",
slugField: null,
variablePluralName: "taskTemplates",
verboseModelName: "Task Template",
pluralizedVerboseModelName: "Task Templates",
navItemOrder: 4,
capitalizedName: "TASKTEMPLATE",
isRowAction: true,
isTable: true,
navItemIcon: "File",
containerWidth: null,
limit: null,
isModal: null,
    hooks: [],
    fields: [//Generated by GetAllSeqModelFieldKeys
{
seqModelFieldID: 359,
unique: false,
fieldName: "id",
autoincrement: true,
primaryKey: true,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "id",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 1,
verboseFieldName: "ID",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Hidden",
columnsOccupied: 12,
summarizedBy: null,
},
{
seqModelFieldID: 360,
unique: false,
fieldName: "description",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "description",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 2,
verboseFieldName: "Description",
fieldWidth: null,
relatedModelID: null,
hideInTable: false,
orderField: false,
dataType: "TEXT",
dataTypeInterface: "string",
controlType: "Text",
columnsOccupied: 12,
summarizedBy: null,
},
{
seqModelFieldID: 361,
unique: false,
fieldName: "isSuspended",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "is_suspended",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 5.5,
verboseFieldName: "Is Suspended",
fieldWidth: null,
relatedModelID: null,
hideInTable: false,
orderField: false,
dataType: "BOOLEAN",
dataTypeInterface: "boolean",
controlType: "Checkbox",
columnsOccupied: 4,
summarizedBy: null,
},
{
seqModelFieldID: 362,
unique: false,
fieldName: "taskCategoryID",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "task_category_id",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 4,
verboseFieldName: "Task Category",
fieldWidth: null,
relatedModelID: 86,
hideInTable: false,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Select",
columnsOccupied: 4,
summarizedBy: null,
},
{
seqModelFieldID: 363,
unique: false,
fieldName: "taskIntervalID",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "task_interval_id",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 5,
verboseFieldName: "Task Interval",
fieldWidth: null,
relatedModelID: 87,
hideInTable: false,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Select",
columnsOccupied: 4,
summarizedBy: null,
},],
    filters: [//Generated by GetAllSeqModelFilterKeys
{
seqModelFilterID: 316,
seqModelID: 91,
seqModelFieldID: 360,
filterQueryName: "q",
listVariableName: null,
filterOrder: 1,
filterCaption: null,
seqModelRelationshipID: null,
modelListID: null,
modelPath: null,
controlType: "Text",
variableName: null,
filterOperator: "Like",
"options": [],
},
{
seqModelFilterID: 319,
seqModelID: 91,
seqModelFieldID: 362,
filterQueryName: "taskCategory",
listVariableName: null,
filterOrder: 2,
filterCaption: "Task Category",
seqModelRelationshipID: null,
modelListID: 86,
modelPath: "task-categories",
controlType: "Select",
variableName: "taskCategory",
filterOperator: "Equal",
"options": [],
},
{
seqModelFilterID: 320,
seqModelID: 91,
seqModelFieldID: 363,
filterQueryName: "taskInterval",
listVariableName: null,
filterOrder: 3,
filterCaption: "Task Interval",
seqModelRelationshipID: null,
modelListID: 87,
modelPath: "task-intervals",
controlType: "Select",
variableName: "taskInterval",
filterOperator: "Equal",
"options": [],
},],
    sorts: [//Generated by GetAllSeqModelSortKeys
{
seqModelSortID: 50,
seqModelFieldID: 359,
modelFieldCaption: "ID",
modelSortOrder: 0,
sortKey: null,
},]
}
