//Generated by WriteToModelinterface_ts - ModelInterface.ts Next 13

//Generated by GetAllRelatedRightModelImport
import { TaskModel } from "@/interfaces/TaskInterfaces";//Generated by GetRelatedRightModelImport - GetRelatedRightModelImport
import { ListQuery } from "./interface";

export interface TaskNoteModel {
  //Generated by GetAllModelFieldTypeBySeqModel
id: number | string;//Generated by GetModelFieldType
note: string | null;//Generated by GetModelFieldType
taskID: number | string;//Generated by GetModelFieldType
file: string | null;//Generated by GetModelFieldType
fileSize: number | string | null;//Generated by GetModelFieldType
fileName: string | null;//Generated by GetModelFieldType
  
  
  //Generated by GetAllRelatedRightModelInterface
Task: TaskModel;//Generated by GetRelatedRightModelInterface - GetRelatedRightModelInterface
}

//The keys after the updatedAt is generated by GetAllRelatedModelNameBySeqModel - RelatedModelName
export interface TaskNoteFormikShape extends Omit<TaskNoteModel, "slug" | "createdAt" | "updatedAt" 
| "Task"//Generated by GetRelatedRightModelName - GetRelatedRightModelName 
> {
  touched: boolean;
  index: number;
}

//Use for continuos list form
export interface TaskNoteFormikInitialValues {
  TaskNotes: TaskNoteFormikShape[];
  TaskNoteFiles: TaskNoteFormikShape[];
}

//The FormikInitialValues is generated by GetAllRelatedFormikInitialValues - ModelFormikInitialValue
export interface TaskNoteFormFormikInitialValues
  extends Omit<TaskNoteFormikShape, "touched" | "index"> {
  
}

//The extends portion is generated by GetModelUpdatePayloadExtension - GetRelatedPartialPayload
export interface TaskNoteUpdatePayload  {
  TaskNotes: Omit<TaskNoteFormikShape, "touched">[];
  TaskNoteFiles: Omit<TaskNoteFormikShape, "touched">[];
}

export interface TaskNoteDeletePayload {
  deletedTaskNotes: string[] | number[];
}

export interface TaskNoteSelectedPayload {
  selectedTaskNotes: string[] | number[];
}

//Use for single form (with children)
//The Related Models will be replaced by the Payload version
export interface TaskNoteFormUpdatePayload
  extends Omit<TaskNoteFormikShape, "touched" | "index" 
> 
 
{
  
}

export interface TaskNoteFormikFilter {
  //Generated by GetAllFilterInterfaceBySeqmodel
hasFile: boolean;//Generated by GetThisFilterInterface
}

export interface TaskNoteSearchParams
  extends ListQuery,
    Omit<TaskNoteFormikFilter, //Generated by GetAllNonStringFilterNames
"hasFile"> {
  //Generated by GetAllNonStringFilterTypes
hasFile: string;//Generated by GetThisFilterInterface
}

export interface GetTaskNotesResponse {
  count: number;
  rows: TaskNoteModel[];
  cursor: string;
}
