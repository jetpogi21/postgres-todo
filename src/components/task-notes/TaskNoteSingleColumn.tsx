//Generated by WriteToModelsinglecolumn_tsx - ModelSingleColumn.tsx
import { ModelSingleColumnProps } from "@/interfaces/GeneralInterfaces";
import { TaskNoteModel } from "@/interfaces/TaskNoteInterfaces";

const TaskNoteSingleColumn = <T,>({
  cell,
}: ModelSingleColumnProps<T>) => {
  const taskNote = cell.row.original as TaskNoteModel;
  return <div className="flex gap-2">Edit Me Bruh!</div>;
};

export default TaskNoteSingleColumn;
