//Generated by WriteToModelsinglecolumn_tsx - ModelSingleColumn.tsx
import { ModelSingleColumnProps } from "@/interfaces/GeneralInterfaces";
import { TaskModel } from "@/interfaces/TaskInterfaces";

const TaskSingleColumn = <T,>({
  cell,
}: ModelSingleColumnProps<T>) => {
  const task = cell.row.original as TaskModel;
  return <div className="flex gap-2">Edit Me Bruh!</div>;
};

export default TaskSingleColumn;
