//Generated by WriteToModelstateholder_tsx - ModelStateHolder.tsx
"use client";
import TaskFilterForm from "@/components/tasks/TaskFilterForm";
import TaskTable from "@/components/tasks/TaskTable";
import { useTableProps } from "@/hooks/useTableProps";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { TaskModel } from "@/interfaces/TaskInterfaces";
import React from "react";

const TaskStateHolder = ({ modelConfig }: { modelConfig: ModelConfig }) => {
  const tableStates = useTableProps<TaskModel>(modelConfig);
  return (
    <>
      <div className="flex">
        <TaskFilterForm tableStates={tableStates} />
      </div>
      <div className="flex flex-col flex-1 ">
        <TaskTable tableStates={tableStates} />
      </div>
    </>
  );
};

export default TaskStateHolder;
