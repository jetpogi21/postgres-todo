//Generated by WriteToModeltable_tsx - ModelTable.tsx for Table 9/18
"use client";
import React, { useEffect } from "react";
import {
  TaskFormikInitialValues,
  TaskModel,
  TaskSearchParams,
} from "@/interfaces/TaskInterfaces";
import { useQueryClient } from "@tanstack/react-query";
import {
  UpdateModelsData,
  useModelsQuery,
  useUpdateModelsMutation,
} from "@/hooks/useModelQuery";
import { TaskConfig } from "@/utils/config/TaskConfig";
import { BasicModel, GetModelsResponse } from "@/interfaces/GeneralInterfaces";
import { useModelPageParams } from "@/hooks/useModelPageParams";
import { getCurrentData } from "@/lib/getCurrentData";
import { getRefetchQueryFunction } from "@/lib/refetchQuery";
import { useTableProps } from "@/hooks/useTableProps";
import ModelDataTable from "@/components/ModelDataTable";
import { createRequiredModelLists } from "@/lib/createRequiredModelLists";
import { getInitialValues } from "@/lib/getInitialValues";
import { toast } from "@/hooks/use-toast";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { ModelSchema } from "@/schema/ModelSchema";
import useGlobalDialog from "@/hooks/useGlobalDialog";
import TaskForm from "@/components/tasks/TaskForm";
import { Row } from "@tanstack/react-table";
import { findModelPrimaryKeyField } from "@/utils/utilities";
import TaskSingleColumn from "@/components/tasks/TaskSingleColumn";
import { useGenericMutation } from "@/hooks/useGenericMutation";
import { getTaskRowActions } from "@/lib/tasks/getTaskRowActions";
import { getTaskColumnsToBeOverriden } from "@/lib/tasks/getTaskColumnsToBeOverriden";

const TaskTable = <T,>({
  tableStates,
}: {
  tableStates: ReturnType<typeof useTableProps<T>>;
}) => {
  const modelConfig = TaskConfig;
  const primaryKeyFieldName = findModelPrimaryKeyField(modelConfig).fieldName;
  const { pluralizedModelName } = modelConfig;
  const pageParams = useModelPageParams<TaskSearchParams>(modelConfig);
  const { params } = pageParams;
  const queryClient = useQueryClient();

  const [mounted, setMounted] = React.useState(false);

  //For Editable Tables
  const requiredList: Record<string, BasicModel[]> =
    createRequiredModelLists(modelConfig);

  //For Editable Tables
  const defaultFormValue = getInitialValues<T>(modelConfig, undefined, {
    childMode: true,
    requiredList,
  });

  //Store Variables
  const {
    page,
    setRecordCount,
    fetchCount,
    setFetchCount,
    currentData: previousData,
    setCurrentData,
    setIsUpdating,
  } = tableStates;

  const queryParams = params;

  const useTaskSearchQuery = () =>
    useModelsQuery<T>(modelConfig, {
      ...queryParams,
      fetchCount: fetchCount.toString(),
    });

  const queryResponse = useTaskSearchQuery();
  const { data, refetch, isFetching } = queryResponse;

  const currentPageData: GetModelsResponse<T> | null = data
    ? data.pages[page - (isFetching ? 2 : 1)]
    : null;
  const currentData = getCurrentData(
    currentPageData,
    previousData,
    modelConfig.isTable ? false : defaultFormValue
  );

  //Client functions
  const refetchQuery = getRefetchQueryFunction(
    modelConfig,
    params,
    refetch,
    queryClient
  );

  //Add any required mutations here
  /* 
  const addTasksFromTemplateMutation =
    useImportTaskFromTemplate((data) => {
      refetchQuery(0);
    });
  const modelActions = {
    "Add Form Templates": addTasksFromTemplateMutation,
  }; 
  */

  //This would produce the same shape as the modelActions above.
  const modelActions = modelConfig.hooks.reduce((prev, cur) => {
    const endPoint = `/${modelConfig.modelPath}/${cur.slug}/`;
    return {
      ...prev,
      [cur.caption]: useGenericMutation({
        endPoint,
        onSuccess: (data) => refetchQuery(0),
      }),
    };
  }, {});

  const { mutate: updateRecords, mutateAsync: asyncUpdateRecords } =
    useUpdateModelsMutation(modelConfig);
  const rowActions = getTaskRowActions({
    currentData,
    setCurrentData,
    mutate: updateRecords,
  });
  /* 
  Run WriteToGetmodelrowaction_tsx - getModelRowAction.tsx
  const rowActions = getTaskRowActions({
    currentData,
    setCurrentData,
    mutate: updateRecords,
  }); 
  */

  const columnsToBeOverriden = getTaskColumnsToBeOverriden<T, unknown>();
  /* 
  Run WriteToGetmodelcolumnstobeoverriden_tsx - getModelColumnsToBeOverriden.tsx
  const columnsToBeOverriden = getTaskColumnsToBeOverriden<
    T,
    unknown
  >();
  */

  const handleSubmit = async (
    values: TaskFormikInitialValues,
    formik: FormikHelpers<TaskFormikInitialValues>
  ) => {
    //The reference is the index of the row
    const rowsToBeSubmitted = (
      values[
        pluralizedModelName as keyof TaskFormikInitialValues
      ] as TaskFormikInitialValues["Tasks"]
    ).filter((item) => item.touched);

    if (rowsToBeSubmitted.length === 0) {
      toast({
        description: `No change detected.`,
      });
      return;
    }

    setIsUpdating(true);
    const payload = {
      [pluralizedModelName]: rowsToBeSubmitted,
    };

    //@ts-ignore
    asyncUpdateRecords(payload).then((data) => {
      const { inserted, updated } =
        data as unknown as UpdateModelsData<TaskModel>;

      Object.keys(inserted).forEach((idx) => {
        const numIdx = idx as unknown as number;
        formik.setFieldValue(`${pluralizedModelName}[${idx}]`, {
          ...values[pluralizedModelName as keyof TaskFormikInitialValues][
            numIdx
          ],
          touched: false,
          [primaryKeyFieldName]:
            inserted[numIdx][primaryKeyFieldName as keyof TaskModel],
        });
      });

      setIsUpdating(false);
      toast({
        variant: "success",
        description: `${modelConfig.pluralizedVerboseModelName} successfully updated`,
      });
    });
  };

  const { openDialog, closeDialog } = useGlobalDialog();

  const openDialogHandler = (row?: Row<T>["original"]) => {
    openDialog({
      title: `${modelConfig.verboseModelName} Form`,
      message: (
        <div className="pt-8">
          <TaskForm
            data={(row ? row : null) as TaskModel | null}
            id={
              row
                ? (row[primaryKeyFieldName as keyof typeof row] as string)
                : "new"
            }
            modalFormProps={{
              onSuccess: () => {
                closeDialog();
                refetchQuery(page - 1);
              },
            }}
          />
        </div>
      ),
      formMode: true,
    });
  };

  const dialogFormProps = { openDialogHandler };

  const columnOrderToOverride: [string, number][] = [["isFinished", 2]];
  /* const columnOrderToOverride = undefined; */

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (currentPageData?.count !== undefined) {
      setRecordCount(currentPageData?.count || 0);
    }
    setFetchCount(false);
    setCurrentData(currentData);
  }, [currentPageData?.count, data, page]);

  const commonProps = {
    modelConfig,
    tableStates,
    refetchQuery,
    queryResponse,
    pageParams,
    rowActions,
    modelActions,
    SingleColumnComponent: TaskSingleColumn,
    requiredList,
    defaultFormValue,
    columnOrderToOverride,
  };

  return (
    mounted &&
    (modelConfig.isTable ? (
      <ModelDataTable
        {...commonProps}
        columnsToBeOverriden={columnsToBeOverriden}
        dialogFormProps={modelConfig.isModal ? dialogFormProps : undefined}
      />
    ) : (
      <Formik
        initialValues={
          {
            [pluralizedModelName]: currentData,
          } as unknown as TaskFormikInitialValues
        }
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={ModelSchema(modelConfig, true)}
        validateOnChange={false}
      >
        {(formik) => (
          <ModelDataTable
            {...commonProps}
            formik={formik as unknown as FormikProps<T>}
          />
        )}
      </Formik>
    ))
  );
};

export default TaskTable;
