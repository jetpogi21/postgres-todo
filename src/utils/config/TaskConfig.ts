//Generated by WriteToModelconfig_ts - ModelConfig.ts
import { ModelConfig } from "@/interfaces/ModelConfig";

export const TaskConfig: ModelConfig = {
    //Generated by GetSeqmodelkeys
seqModelID: 85,
modelName: "Task",
tableName: "taskmanager_task",
timestamps: false,
pluralizedModelName: "Tasks",
modelPath: "tasks",
variableName: "task",
isMainQuery: true,
sortString: "-date",
slugField: null,
variablePluralName: "tasks",
verboseModelName: "Task",
pluralizedVerboseModelName: "Tasks",
navItemOrder: 5,
capitalizedName: "TASK",
isRowAction: true,
isTable: true,
navItemIcon: "CheckSquare",
containerWidth: null,
limit: null,
isModal: null,
    fields: [//Generated by GetAllSeqModelFieldKeys
{
seqModelFieldID: 335,
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
relatedModelID: 46,
hideInTable: false,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Select",
columnsOccupied: 6,
summarizedBy: null,
},
{
seqModelFieldID: 336,
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
relatedModelID: 47,
hideInTable: false,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Select",
columnsOccupied: 6,
summarizedBy: null,
},
{
seqModelFieldID: 337,
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
seqModelFieldID: 338,
unique: false,
fieldName: "description",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: "(50)",
databaseFieldName: "description",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 2,
verboseFieldName: "Description",
fieldWidth: null,
relatedModelID: null,
hideInTable: false,
orderField: false,
dataType: "STRING",
dataTypeInterface: "string",
controlType: "Textarea",
columnsOccupied: 12,
summarizedBy: null,
},
{
seqModelFieldID: 339,
unique: false,
fieldName: "taskTemplateID",
autoincrement: false,
primaryKey: false,
allowNull: true,
dataTypeOption: null,
databaseFieldName: "task_template_id",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 6,
verboseFieldName: "Task Template ID",
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
seqModelFieldID: 340,
unique: false,
fieldName: "date",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "date",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 7,
verboseFieldName: "Date",
fieldWidth: null,
relatedModelID: null,
hideInTable: false,
orderField: false,
dataType: "DATEONLY",
dataTypeInterface: "string",
controlType: "Date",
columnsOccupied: 6,
summarizedBy: null,
},
{
seqModelFieldID: 341,
unique: false,
fieldName: "targetDate",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "target_date",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 8,
verboseFieldName: "Target Date",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "DATEONLY",
dataTypeInterface: "string",
controlType: "Date",
columnsOccupied: 6,
summarizedBy: null,
},
{
seqModelFieldID: 342,
unique: false,
fieldName: "finishDateTime",
autoincrement: false,
primaryKey: false,
allowNull: true,
dataTypeOption: null,
databaseFieldName: "finish_date_time",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 9,
verboseFieldName: "Finish Date Time",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "DATE",
dataTypeInterface: "string",
controlType: "DateAndTime",
columnsOccupied: 10,
summarizedBy: null,
},
{
seqModelFieldID: 343,
unique: false,
fieldName: "isFinished",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "is_finished",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 9.1,
verboseFieldName: "Is Finished",
fieldWidth: null,
relatedModelID: null,
hideInTable: false,
orderField: false,
dataType: "BOOLEAN",
dataTypeInterface: "boolean",
controlType: "Checkbox",
columnsOccupied: 2,
summarizedBy: null,
},
{
seqModelFieldID: 344,
unique: false,
fieldName: "subTaskImported",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "sub_task_imported",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 11,
verboseFieldName: "Sub Task Imported",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "BOOLEAN",
dataTypeInterface: "boolean",
controlType: "Hidden",
columnsOccupied: 12,
summarizedBy: null,
},],
    filters: [//Generated by GetAllSeqModelFilterKeys
{
seqModelFilterID: 306,
seqModelID: 85,
seqModelFieldID: 338,
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
seqModelFilterID: 307,
seqModelID: 85,
seqModelFieldID: 336,
filterQueryName: "taskInterval",
listVariableName: null,
filterOrder: 3,
filterCaption: "Task Interval",
seqModelRelationshipID: null,
modelListID: null,
modelPath: null,
controlType: "Select",
variableName: null,
filterOperator: "Equal",
"options": [],
},
{
seqModelFilterID: 309,
seqModelID: 85,
seqModelFieldID: 343,
filterQueryName: "status",
listVariableName: null,
filterOrder: 6,
filterCaption: "Status",
seqModelRelationshipID: null,
modelListID: null,
modelPath: null,
controlType: "Select",
variableName: null,
filterOperator: "Equal",
"options": [],
},
{
seqModelFilterID: 310,
seqModelID: 85,
seqModelFieldID: 340,
filterQueryName: "date",
listVariableName: null,
filterOrder: 7,
filterCaption: "Date",
seqModelRelationshipID: null,
modelListID: null,
modelPath: null,
controlType: "DateRangePicker",
variableName: null,
filterOperator: "Between",
"options": [],
},
{
seqModelFilterID: 311,
seqModelID: 85,
seqModelFieldID: 335,
filterQueryName: "taskCategory",
listVariableName: null,
filterOrder: 2,
filterCaption: "Task Category",
seqModelRelationshipID: null,
modelListID: null,
modelPath: null,
controlType: "Select",
variableName: null,
filterOperator: "Equal",
"options": [],
},],
    sorts: [//Generated by GetAllSeqModelSortKeys
{
seqModelSortID: 44,
seqModelFieldID: 340,
modelFieldCaption: "Date",
modelSortOrder: 1,
sortKey: null,
},]
}
