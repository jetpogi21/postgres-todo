//Generated by WriteToModelstateholder_tsx - ModelStateHolder.tsx
"use client";
import TaskIntervalFilterForm from "@/components/task-intervals/TaskIntervalFilterForm";
import TaskIntervalTable from "@/components/task-intervals/TaskIntervalTable";
import { useTableProps } from "@/hooks/useTableProps";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { TaskIntervalModel } from "@/interfaces/TaskIntervalInterfaces";
import React from "react";

const TaskIntervalStateHolder = ({ modelConfig }: { modelConfig: ModelConfig }) => {
  const tableStates = useTableProps<TaskIntervalModel>(modelConfig);
  return (
    <>
      <div className="flex">
        <TaskIntervalFilterForm tableStates={tableStates} />
      </div>
      <div className="flex flex-col flex-1 ">
        <TaskIntervalTable tableStates={tableStates} />
      </div>
    </>
  );
};

export default TaskIntervalStateHolder;
