"use client";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  findConfigItem,
  findLeftForeignKeyField,
  findModelPrimaryKeyField,
  findRelationshipModelConfig,
  getSorting,
  replaceHighestOrder,
} from "@/utils/utilities";
import { removeItemsByIndexes } from "@/utils/utils";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  Row,
} from "@tanstack/react-table";
import { FormikHelpers, FormikProps } from "formik";
import { ChevronLast, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Decimal from "decimal.js";
import {
  BasicModel,
  ModelSingleColumnProps,
} from "@/interfaces/GeneralInterfaces";
import { createRequiredModelLists } from "@/lib/createRequiredModelLists";
import { AppConfig } from "@/lib/app-config";
import { getModelColumns } from "@/lib/getModelColumns";
import { getInitialValues } from "@/lib/getInitialValues";
import { ModelDeleteDialog } from "@/components/ModelDeleteDialog";
import { DataTable } from "@/components/ui/DataTable";
import { useTableProps } from "@/hooks/useTableProps";
import { sortFunction } from "@/lib/sortFunction";
import { getFirstAndLastFieldInForm } from "@/lib/getFirstAndLastFieldInForm";
import { getColumnOrder } from "@/lib/getColumnOrder";
import { ColumnsToBeOverriden } from "@/lib/table-utils";
import useScreenSize from "@/hooks/useScreenSize";
import { getModelForms, getModelSingleColumns } from "@/lib/getModelOptions";
import useGlobalDialog from "@/hooks/useGlobalDialog";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { getRowIndentifier } from "@/lib/getRowIndentifier";
import { useSessionStorage } from "usehooks-ts";
import { getSessionStorage } from "@/lib/getSessionStorage";
import { boolean } from "zod";

interface ModelSubformProps<T> {
  formik: FormikProps<T>;
  setHasUpdate: () => void;
  relationshipConfig: (typeof AppConfig)["relationships"][number];
  filterFunction?: (item: Record<string, unknown>) => boolean;
  columnOrderToOverride?: [string, number][];
  columnsToBeOverriden?: ColumnsToBeOverriden<T, unknown>;
}

type ArrayOfObject = Record<string, unknown>[];

const ModelSubform = <T,>({
  formik,
  setHasUpdate,
  relationshipConfig,
  filterFunction,
  columnOrderToOverride,
  columnsToBeOverriden,
}: ModelSubformProps<T>) => {
  const [willFocus, setWillFocus] = useState(false);
  const ref: React.RefObject<HTMLElement> = useRef(null); //to be attached to the last row in form, first control in that row

  const modelConfig = findRelationshipModelConfig(
    relationshipConfig.seqModelRelationshipID,
    "LEFT"
  );
  const primaryKeyField = findModelPrimaryKeyField(modelConfig).fieldName;
  const leftFieldName = findLeftForeignKeyField(
    relationshipConfig.seqModelRelationshipID
  );
  const parentModelConfig = findRelationshipModelConfig(
    relationshipConfig.seqModelRelationshipID,
    "RIGHT"
  );
  const parentPrimaryKeyField =
    findModelPrimaryKeyField(parentModelConfig).fieldName;
  const pluralizedModelName = modelConfig.pluralizedModelName;

  const shouldCollapse = useScreenSize("lg");

  const rows = useMemo(
    () =>
      (formik.values[pluralizedModelName as keyof T] as ArrayOfObject).filter(
        filterFunction || Boolean
      ) as ArrayOfObject,
    [formik.values[pluralizedModelName as keyof T], filterFunction]
  );

  /* const rows = [
    ...(formik.values[pluralizedModelName as keyof T] as ArrayOfObject),
  ].filter(filterFunction || Boolean) as ArrayOfObject; */
  const {
    rowSelection,
    setRowSelection,
    setRowSelectionByIndex,
    resetRowSelection,
    setRowSelectionToAll,
    sort,
    setSort,
    recordsToDelete,
    setRecordsToDelete,
  } = useTableProps(modelConfig);

  const requiredList: Record<string, BasicModel[]> =
    createRequiredModelLists(modelConfig);

  //Page Constants
  const defaultFormValue = getInitialValues<T>(modelConfig, undefined, {
    childMode: true,
    requiredList,
    leftFieldName: leftFieldName.fieldName,
  });

  //Transformations
  const sorting = getSorting(sort);
  const hasSelected = Object.values(rowSelection).some((val) => val);

  const dataRowCount = rows.filter((item) => item[primaryKeyField]).length;
  const pageStatus = `Showing ${dataRowCount} of ${dataRowCount} record(s)`;

  //Client Actions
  const focusOnRef = () => {
    ref && ref.current?.focus();
  };

  const draggableField = modelConfig.fields.find((field) => field.orderField);

  const addRow = () => {
    const newRowValue: Record<string, unknown> = {
      ...defaultFormValue,
      [leftFieldName.fieldName]:
        formik.values[parentPrimaryKeyField as keyof T],
    };

    if (draggableField) {
      newRowValue[draggableField.fieldName] = replaceHighestOrder(
        rows,
        draggableField.fieldName
      );
    }
    formik.setFieldValue(`${pluralizedModelName}`, [...rows, newRowValue]);

    setWillFocus(true);
  };

  const setTouchedRows = (idx: number) => {
    formik.setFieldValue(`${pluralizedModelName}[${idx}].touched`, true);
  };

  const deleteRow = (idx: number) => {
    const id = rows[idx][primaryKeyField];

    if (id) {
      setRecordsToDelete([id.toString()]);
    } else {
      formik.setFieldValue(pluralizedModelName, [
        ...rows.slice(0, idx),
        ...rows.slice(idx + 1),
      ]);
      formik.setErrors({});
      resetRowSelection();
    }
  };

  const deleteSelectedRows = () => {
    const indexes = Object.keys(rowSelection)
      .filter((item) => rowSelection[item])
      .map((item) => parseInt(item));

    //Compute the Ids to be deleted. the index should be the selected indexes. then see if the rows has an actual id value
    const deletedIDs = rows
      .filter((_, idx) => indexes.includes(idx))
      .filter((item) => !!item[primaryKeyField])
      .map((item) => (item[primaryKeyField] as string).toString()) as string[];

    if (deletedIDs.length > 0) {
      setRecordsToDelete(deletedIDs);
    } else {
      formik.setFieldValue(
        pluralizedModelName,
        removeItemsByIndexes(rows, indexes)
      );
      formik.setErrors({});
      resetRowSelection();
    }
  };

  const toggleRow = (idx: number) => setRowSelectionByIndex(idx);
  const toggleSelectAllRow = () => {
    if (Object.keys(rowSelection).length === rows.length) {
      resetRowSelection();
    } else {
      setRowSelectionToAll(rows.length);
    }
  };

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    if (draggableField) {
      const { values, setFieldValue } = formik;
      const Models = values[pluralizedModelName as keyof T] as ArrayOfObject;

      // Clone the SubTasks array
      const newArray = [
        ...Models.map((item, idx) => ({
          ...item,
          touched:
            idx === targetRowIndex || idx === draggedRowIndex
              ? true
              : item.touched,
        })),
      ] as ArrayOfObject;

      const rowOrder = Models[targetRowIndex].priority as string;
      // Remove the item from its original position
      const [draggedItem] = newArray.splice(draggedRowIndex, 1);

      const draggedItemOrder = new Decimal(rowOrder).minus(new Decimal("0.01"));
      draggedItem[draggableField.fieldName] = draggedItemOrder.toString();

      // Insert the item at the target position
      newArray.splice(targetRowIndex, 0, draggedItem);

      // Update the priority field based on the index
      const updatedArray = newArray.map((item, idx) => ({
        ...item,
      }));

      // Update the formik field value
      setFieldValue(pluralizedModelName, updatedArray);
      setHasUpdate();
    }
  };

  const handleSortChange = (sortingState: SortingState) => {
    const sortParams = sortingState
      .map((item) => {
        if (item.desc) {
          return `-${item.id}`;
        } else {
          return `${item.id}`;
        }
      })
      .join(",");

    setSort(sortParams);

    formik.setFieldValue(
      pluralizedModelName,
      rows.filter((item) => item.id).sort(sortFunction(sortParams, modelConfig))
    );
    resetRowSelection();
  };

  //This will be the additional properties to be used by this subform model (to be passed from the parent or from the modelConfig (to simplify))
  //@ts-ignore
  const SingleColumnComponent = getModelSingleColumns()[
    modelConfig.modelName
  ] as React.FC<ModelSingleColumnProps<T>> | undefined;
  const FormComponent =
    getModelForms()[
      modelConfig.modelName as keyof ReturnType<typeof getModelForms>
    ];

  const { openDialog, closeDialog } = useGlobalDialog();

  const [queue, setQueue] = useSessionStorage<T[]>(
    "queue",
    formik.values[pluralizedModelName as keyof typeof formik.values] as T[]
  );

  const openDialogHandler = (row?: Row<T>["original"]) => {
    openDialog({
      title: `${modelConfig.verboseModelName} Form`,
      message: (
        <div className="pt-8">
          <FormComponent
            //@ts-ignore
            data={(row ? row : null) as T | null}
            id={
              row
                ? (row[
                    getRowIndentifier(modelConfig) as keyof typeof row
                  ] as string) || "new"
                : "new"
            }
            modalFormProps={{
              onSuccess: () => {
                closeDialog();
              },
            }}
            hiddenField={relationshipConfig.leftForeignKey}
            onSubmit={(values, childFormik) => {
              //this will signify if the form will go to new value upon submission (so technically do not close the dialog)

              type ValueKey = keyof typeof values;
              type FormikValueKey = keyof typeof formik.values;
              const addNew: boolean = values[
                "addNew" as ValueKey
              ] as unknown as boolean;
              const queue = getSessionStorage<T[]>("queue") || [];

              const goToNewRecord = () => {
                childFormik.setValues(
                  //@ts-ignore
                  getInitialValues<T>(modelConfig, undefined, {
                    requiredList,
                    defaultValues: {
                      [leftFieldName.fieldName]:
                        formik.values[parentPrimaryKeyField as FormikValueKey],
                    },
                  })
                );

                const [firstFieldInForm, _] = getFirstAndLastFieldInForm(
                  modelConfig.fields,
                  relationshipConfig
                );

                (document.querySelector(
                  `#${firstFieldInForm}`
                ) as HTMLElement)!.focus();
              };

              //Check wether this is a new row or not signified by the id field
              const rows = formik.values[pluralizedModelName as FormikValueKey];
              const primaryKeyValue = values[primaryKeyField as ValueKey];

              //@ts-ignore
              setQueue([...queue, { ...values, touched: true }]);

              if (addNew) {
                //@ts-ignore
                setQueue([...queue, { ...values, touched: true }]);
                goToNewRecord();
              } else {
                let newRows = rows as T[];

                queue.forEach((queued) => {
                  const primaryKeyValue =
                    queued[primaryKeyField as keyof typeof queued];
                  if (primaryKeyValue) {
                    newRows = newRows.map((item) =>
                      item[primaryKeyField as keyof typeof item] ==
                      primaryKeyValue
                        ? { ...queued, touched: true }
                        : item
                    );
                  } else {
                    newRows = [...newRows, { ...queued, touched: true }];
                  }
                });
                if (primaryKeyValue) {
                  //@ts-ignore
                  newRows = newRows.map((item) =>
                    item[primaryKeyValue as keyof typeof item] ==
                    primaryKeyValue
                      ? { ...values, touched: true }
                      : item
                  );
                } else {
                  //@ts-ignore
                  newRows = [...newRows, { ...values, touched: true }];
                }

                formik.setFieldValue(pluralizedModelName, newRows);
                closeDialog();
                setQueue([]);
              }
            }}
          />
        </div>
      ),
      formMode: true,
    });
  };

  const onRowClick = shouldCollapse ? openDialogHandler : undefined;

  const columnVisibility: Record<string, boolean> = modelConfig.fields.reduce(
    (acc: Record<string, boolean>, field) => {
      if (relationshipConfig.leftForeignKey === field.fieldName) {
        acc[field.fieldName] = false;
      } else if (field.hideInTable) {
        acc[field.fieldName] = false;
      } else {
        acc[field.fieldName] = SingleColumnComponent ? !shouldCollapse : true;
      }
      return acc;
    },
    { singleColumn: shouldCollapse }
  );

  const columnOrder: string[] = getColumnOrder(
    modelConfig,
    columnOrderToOverride
  );

  const [firstFieldInForm, lastFieldInForm] = getFirstAndLastFieldInForm(
    modelConfig.fields,
    relationshipConfig
  );

  const modelColumns = useMemo(
    () =>
      getModelColumns<T, unknown>({
        modelConfig,
        ModelSingleColumn: SingleColumnComponent,
        columnsToBeOverriden,
      }),
    [modelConfig]
  );

  const modelTable = useReactTable<T>({
    data: rows as T[],
    columns: modelColumns,
    state: {
      sorting: sorting,
      rowSelection,
    },
    //@ts-ignore
    onRowSelectionChange: (state) => setRowSelection(state()),
    //@ts-ignore
    onSortingChange: (state) => handleSortChange(state()), //since the sort state is getting tracked from the url do handle instead
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: true,
    initialState: {
      columnVisibility,
      columnOrder,
    },
    meta: {
      name: modelConfig.pluralizedModelName,
      setHasUpdate,
      setTouchedRows,
      addRow,
      deleteRow,
      toggleRow,
      toggleSelectAllRow,
      firstFieldInForm: firstFieldInForm,
      lastFieldInForm: lastFieldInForm,
      forwardedRef: ref,
      editable: true,
      options: { ...requiredList },
      rowActions: {},
    },
  });

  //useEffects here
  useEffect(() => {
    if (willFocus) {
      focusOnRef();
    }
  }, [rows.length]);

  const toolRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    if (toolRef.current) {
      observer.observe(toolRef.current);
    }

    return () => {
      if (toolRef.current) {
        observer.unobserve(toolRef.current);
      }
    };
  }, []);

  useEffect(() => {
    modelTable.getAllColumns().forEach((column) => {
      if (
        ![
          "select",
          "actions",
          ...modelConfig.fields
            .filter((item) => {
              if (relationshipConfig.leftForeignKey === item.fieldName) {
                return true;
              } else {
                return item.hideInTable;
              }
            })
            .map((item) => item.fieldName),
        ].includes(column.id)
      ) {
        if (column.id === "singleColumn") {
          if (SingleColumnComponent) {
            column.toggleVisibility(shouldCollapse);
          } else {
            column.toggleVisibility(false);
          }
        } else {
          column.toggleVisibility(
            !Boolean(SingleColumnComponent) || !shouldCollapse
          );
        }
      }
    });
  }, [shouldCollapse]);

  return (
    <div
      className="flex flex-col gap-2"
      style={{ gridArea: pluralizedModelName }}
    >
      <h3 className="text-xl font-bold">
        {modelConfig.pluralizedVerboseModelName}
      </h3>
      <div
        className="flex items-center gap-4"
        ref={toolRef}
      >
        <div
          className={cn(
            "flex items-center gap-4",
            !isVisible &&
              hasSelected &&
              "fixed left-0 right-0 m-auto bottom-5 border-2 border-border w-3/4 bg-background h-[50px] p-4 z-10 rounded-lg shadow-sm"
          )}
        >
          <div className="text-sm">
            {modelTable.getFilteredSelectedRowModel().rows.length} of{" "}
            {modelTable.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          {hasSelected && (
            <>
              {!isVisible && (
                <Button
                  type="button"
                  size={"sm"}
                  variant={"secondary"}
                  onClick={resetRowSelection}
                  className="flex items-center justify-center gap-1"
                >
                  Clear Selection
                </Button>
              )}
              <Button
                type="button"
                size={"sm"}
                variant={"destructive"}
                onClick={deleteSelectedRows}
                className="flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
        {shouldCollapse ? (
          <Button
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "ml-auto"
            )}
            onClick={() =>
              openDialogHandler({
                ...defaultFormValue,
                [leftFieldName.fieldName]:
                  formik.values[parentPrimaryKeyField as keyof T],
              })
            }
          >
            Add New
          </Button>
        ) : (
          <Button
            className="ml-auto"
            variant={"secondary"}
            type="button"
            size="sm"
            onClick={focusOnRef}
          >
            <ChevronLast className="w-4 h-4 text-foreground" />
            Go to last row
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <DataTable
          modelConfig={modelConfig}
          table={modelTable}
          isLoading={false}
          draggableField={draggableField}
          reorderRow={reorderRow}
          onRowClick={onRowClick}
        />
      </div>
      <div className="flex items-center justify-between flex-1 text-sm select-none text-muted-foreground">
        {
          <div className="flex items-center justify-between w-full gap-4">
            <p className={cn("lg:hidden")}>{pageStatus}</p>
            <div className="hidden gap-2 lg:flex">
              <Button
                type="button"
                size="sm"
                variant={"secondary"}
                onClick={addRow}
              >
                <Plus className="w-4 h-4 text-foreground" /> Add Row
              </Button>
            </div>
          </div>
        }
      </div>
      <ModelDeleteDialog
        formik={formik}
        modelConfig={modelConfig}
        recordsToDelete={recordsToDelete}
        setRecordsToDelete={setRecordsToDelete}
        resetRowSelection={resetRowSelection}
      />
    </div>
  );
};

export default ModelSubform;
