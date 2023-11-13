//Generated by WriteToModelstateholder_tsx - ModelStateHolder.tsx
"use client";
import SubTaskTemplateFilterForm from "@/components/sub-task-templates/SubTaskTemplateFilterForm";
import SubTaskTemplateTable from "@/components/sub-task-templates/SubTaskTemplateTable";
import { useTableProps } from "@/hooks/useTableProps";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { SubTaskTemplateModel } from "@/interfaces/SubTaskTemplateInterfaces";
import React from "react";

const SubTaskTemplateStateHolder = ({
  modelConfig,
}: {
  modelConfig: ModelConfig;
}) => {
  const tableStates = useTableProps<SubTaskTemplateModel>(modelConfig);
  return (
    <>
      <div className="flex">
        <SubTaskTemplateFilterForm tableStates={tableStates} />
      </div>
      <div className="flex flex-col flex-1 ">
        <SubTaskTemplateTable tableStates={tableStates} />
      </div>
    </>
  );
};

export default SubTaskTemplateStateHolder;
