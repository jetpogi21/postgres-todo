//Generated by WriteToModelinterface_ts - ModelInterface.ts Next 13
//Generated by GetAllRelatedInterfaceImportBySeqModel
//Generated by GetRelatedInterfaceImport - RelatedInterfaceImport
import {
  TaskFormikInitialValues,
  TaskFormikShape,
  TaskModel,
  TaskUpdatePayload,
} from "@/interfaces/TaskInterfaces";

import { ListQuery } from "./interface";

export interface TaskIntervalModel {
  //Generated by GetAllModelFieldTypeBySeqModel
  id: number | string; //Generated by GetModelFieldType
  name: string; //Generated by GetModelFieldType
  //Generated by GetAllChildModelInterfaceBySeqModel
  Tasks: TaskModel[]; //Generated by GetChildModelInterface - ChildModelInterface
}

//The keys after the updatedAt is generated by GetAllRelatedModelNameBySeqModel - RelatedModelName
export interface TaskIntervalFormikShape
  extends Omit<
    TaskIntervalModel,
    "slug" | "createdAt" | "updatedAt" | "Tasks" //Generated by GetRelatedPluralizedModelName - RelatedPluralizedModelName
  > {
  touched: boolean;
  index: number;
}

//Use for continuos list form
export interface TaskIntervalFormikInitialValues {
  TaskIntervals: TaskIntervalFormikShape[];
}

//The FormikInitialValues is generated by GetAllRelatedFormikInitialValues - ModelFormikInitialValue
export interface TaskIntervalFormFormikInitialValues
  extends Omit<TaskIntervalFormikShape, "touched" | "index"> {}

//The extends portion is generated by GetModelUpdatePayloadExtension - GetRelatedPartialPayload
export interface TaskIntervalUpdatePayload {
  TaskIntervals: Omit<TaskIntervalFormikShape, "touched">[];
}

export interface TaskIntervalDeletePayload {
  deletedTaskIntervals: string[] | number[];
}

export interface TaskIntervalSelectedPayload {
  selectedTaskIntervals: string[] | number[];
}

//Use for single form (with children)
//The Related Models will be replaced by the Payload version
export interface TaskIntervalFormUpdatePayload
  extends Omit<TaskIntervalFormikShape, "touched" | "index"> {}

export interface TaskIntervalFormikFilter {
  //Generated by GetAllFilterInterfaceBySeqmodel
  q: string;
}

export interface TaskIntervalSearchParams
  extends ListQuery,
    Omit<TaskIntervalFormikFilter, ""> {
  //Generated by GetAllNonStringFilterTypes
}

export interface GetTaskIntervalsResponse {
  count: number;
  rows: TaskIntervalModel[];
  cursor: string;
}
