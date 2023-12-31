//Generated by WriteToModelsPage - Model Page Sidebar
import React from "react";
import PageSession from "@/components/PageSession";
import { TaskIntervalConfig } from "@/utils/config/TaskIntervalConfig";
import TaskIntervalStateHolder from "@/components/task-intervals/TaskIntervalStateHolder";

const config = TaskIntervalConfig;

export const metadata = {
  title: config.pluralizedVerboseModelName,
};

const TaskIntervals: React.FC = () => {
  return (
    <>
      <div className="flex flex-col flex-1 w-full mx-auto text-sm 2xl:px-0 main-height-less-footer">
        <div className="flex flex-col flex-1 w-full gap-4 pl-4 mx-auto rounded-sm">
          <h1 className="text-2xl font-bold">
            {config.pluralizedVerboseModelName}
          </h1>
          <TaskIntervalStateHolder modelConfig={config} />
        </div>
      </div>
      <PageSession />
    </>
  );
};

export default TaskIntervals;
