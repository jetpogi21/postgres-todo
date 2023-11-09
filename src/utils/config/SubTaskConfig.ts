//Generated by WriteToModelconfig_ts - ModelConfig.ts
import { ModelConfig } from "@/interfaces/ModelConfig";

export const SubTaskConfig: ModelConfig = {
    //Generated by GetSeqmodelkeys
seqModelID: 90,
modelName: "SubTask",
tableName: "subtasks",
timestamps: false,
pluralizedModelName: "SubTasks",
modelPath: "sub-tasks",
variableName: "subTask",
isMainQuery: false,
sortString: "priority",
slugField: null,
variablePluralName: "subTasks",
verboseModelName: "Sub Task",
pluralizedVerboseModelName: "Sub Tasks",
navItemOrder: null,
capitalizedName: "SUBTASK",
isRowAction: false,
isTable: false,
navItemIcon: null,
containerWidth: null,
limit: null,
isModal: null,
    fields: [//Generated by GetAllSeqModelFieldKeys
{
seqModelFieldID: 354,
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
seqModelFieldID: 355,
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
seqModelFieldID: 356,
unique: false,
fieldName: "priority",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: "(4,2)",
databaseFieldName: "priority",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 3,
verboseFieldName: "Priority",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: true,
dataType: "DECIMAL",
dataTypeInterface: "number",
controlType: "Decimal",
columnsOccupied: 12,
summarizedBy: null,
},
{
seqModelFieldID: 357,
unique: false,
fieldName: "finishDateTime",
autoincrement: false,
primaryKey: false,
allowNull: true,
dataTypeOption: null,
databaseFieldName: "finish_date_time",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 4,
verboseFieldName: "Finish Date Time",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "DATE",
dataTypeInterface: "string",
controlType: "DateAndTime",
columnsOccupied: 12,
summarizedBy: null,
},
{
seqModelFieldID: 358,
unique: false,
fieldName: "taskID",
autoincrement: false,
primaryKey: false,
allowNull: false,
dataTypeOption: null,
databaseFieldName: "task_id",
pluralizedFieldName: null,
allowedOptions: null,
fieldOrder: 5,
verboseFieldName: "Task ID",
fieldWidth: null,
relatedModelID: null,
hideInTable: true,
orderField: false,
dataType: "BIGINT",
dataTypeInterface: "number",
controlType: "Text",
columnsOccupied: 12,
summarizedBy: null,
},],
    filters: [],
    sorts: [//Generated by GetAllSeqModelSortKeys
{
seqModelSortID: 48,
seqModelFieldID: 356,
modelFieldCaption: "Priority",
modelSortOrder: 1,
sortKey: null,
},]
}
