//Generated by WriteToModelform_tsxUsingModelconfig - ModelForm.tsx using modelConfig
"use client";
import {
  TaskTemplateFormFormikInitialValues,
  TaskTemplateModel,
  TaskTemplateSearchParams,
} from "@/interfaces/TaskTemplateInterfaces";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, {
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BasicModel } from "@/interfaces/GeneralInterfaces";
import { useListURLStore, useURL } from "@/hooks/useURL";
import { Button } from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { toast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";
import { findModelPrimaryKeyField } from "@/utils/utilities";
import { TaskTemplateConfig } from "@/utils/config/TaskTemplateConfig";
import { mapOriginalSimpleModels } from "@/lib/mapOriginalSimpleModels";
import { createRequiredModelLists } from "@/lib/createRequiredModelLists";
import { useModelQuery } from "@/hooks/useModelQuery";
import { generateDeletedAndNewSimpleecords } from "@/lib/generateDeletedAndNewSimpleecords";
import { FormikFormControlGenerator } from "@/components/FormikFormControlGenerator";
import { ModelSchema } from "@/schema/ModelSchema";
import { getInitialValues } from "@/lib/getInitialValues";
import { createClientPayload } from "@/lib/createClientPayload";
import { updateFormFieldsBasedOnRelationships } from "@/lib/updateFormFieldsBasedOnRelationships";
import { updateSimpleModelsBasedOnRelationships } from "@/lib/updateSimpleModelsBasedOnRelationships";
import FormikSubformGenerator from "@/components/FormikSubformGenerator";
import { getPrevURL } from "@/lib/getPrevURL";
import { ModelDeleteDialog } from "@/components/ModelDeleteDialog";
import ModelDropzonesForRelationships from "@/components/ModelDropzonesForRelationships";
import { generateGridTemplateAreas } from "@/lib/generateGridTemplateAreas";
import { cn } from "@/lib/utils";
import { getFirstAndLastFieldInForm } from "@/lib/getFirstAndLastFieldInForm";
import useScreenSize from "@/hooks/useScreenSize";

interface ModelFormProps {
  onSuccess: () => void;
}

interface TaskTemplateFormProps {
  data: TaskTemplateModel | null;
  id: string;
  modalFormProps?: ModelFormProps;
  hiddenField?: string;
  onSubmit?: (
    values: TaskTemplateFormFormikInitialValues,
    formik: FormikHelpers<TaskTemplateFormFormikInitialValues>
  ) => void;
}

const modelConfig = TaskTemplateConfig;
const primaryKeyField = findModelPrimaryKeyField(modelConfig).fieldName;
const slugField = modelConfig.slugField || primaryKeyField;

const TaskTemplateForm: React.FC<TaskTemplateFormProps> = (prop) => {
  const { id, modalFormProps, hiddenField, onSubmit } = prop;
  const { router, query, pathname } = useURL<TaskTemplateSearchParams>();

  //Local states
  const [mounted, setMounted] = useState(false);
  const [recordName, setRecordName] = useState(
    prop.data
      ? modelConfig.slugField
        ? (prop.data[modelConfig.slugField as keyof typeof prop.data] as string)
        : prop.data.id.toString()
      : "New " + modelConfig.verboseModelName
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [recordsToDelete, setRecordsToDelete] = useState<string[]>([]);
  //{ TaskTemplateTags: [] } ->
  const [originalSimpleModels, setOriginalSimpleModels] = useState(
    mapOriginalSimpleModels(
      prop as unknown as Record<string, unknown>,
      modelConfig
    )
  );

  const ref = useRef<any>(null);

  const { listURL } = useListURLStore((state) => ({
    listURL: state.listURL,
  }));

  //Derive prev URL from the listURL
  const prevURL = getPrevURL(listURL, modelConfig, pathname);

  const requiredList: Record<string, BasicModel[]> =
    createRequiredModelLists(modelConfig);

  //Generated by GetAllRelatedListFromRightRelatedModel

  const { modelMutation, modelQuery } = useModelQuery(modelConfig, id, {
    enabled: mounted && id !== "new",
    initialData: prop.data,
  });

  const taskTemplate = modelQuery.data as TaskTemplateFormFormikInitialValues;

  const isLarge = useScreenSize("lg");
  const initialValues = getInitialValues<TaskTemplateFormFormikInitialValues>(
    modelConfig,
    taskTemplate,
    { requiredList, skipEmptyRow: isLarge }
  );

  const handleFocus = () => {
    ref && ref.current && ref.current.focus();
  };

  const handleHasUdpate = () => {
    setHasUpdate(true);
  };

  const handleFormikSubmit = (
    values: TaskTemplateFormFormikInitialValues,
    formik: FormikHelpers<TaskTemplateFormFormikInitialValues>
  ) => {
    //This property of the form is used to override the default form submission
    if (onSubmit) {
      onSubmit(values, formik);
      return;
    }

    //@ts-ignore
    const addNew: boolean = values.addNew;
    setIsUpdating(true);

    const goToNewRecord = () => {
      formik.setValues(
        getInitialValues<TaskTemplateFormFormikInitialValues>(
          modelConfig,
          undefined,
          { requiredList }
        )
      );
      if (!modalFormProps) {
        window.history.pushState(
          {},
          "",
          `${window.location.origin}/${modelConfig.modelPath}/new`
        );
      }

      setRecordName(`New ${modelConfig.verboseModelName}`);

      const [firstFieldInForm, _] = getFirstAndLastFieldInForm(
        modelConfig.fields
      );
      (document.querySelector(`#${firstFieldInForm}`) as HTMLElement)!.focus();
    };

    //e.g. { deletedTaskTemplateTags: [], newTags: []}
    const deletedAndNewSimpleRecords = generateDeletedAndNewSimpleecords(
      modelConfig,
      originalSimpleModels,
      //@ts-ignore
      values
    );

    if (hasUpdate) {
      const payload = createClientPayload(
        //@ts-ignore
        values,
        modelConfig,
        deletedAndNewSimpleRecords
      );
      modelMutation
        //@ts-ignore
        .mutateAsync(payload)
        .then((data) => {
          if (addNew) {
            goToNewRecord();
          } else {
            //if there's a primary key field returned from the api then replace the formik value with it
            if (data[primaryKeyField]) {
              formik.setFieldValue(primaryKeyField, data[primaryKeyField]);

              if (!modalFormProps) {
                window.history.pushState(
                  {},
                  "",
                  `${window.location.origin}/${modelConfig.modelPath}/${data[primaryKeyField]}`
                );
              }
            }

            //This will replace the breadcrum record name
            setRecordName(
              data[slugField]
                ? (data[slugField] as string)
                : (values[slugField as keyof typeof values] as string)
            );

            updateFormFieldsBasedOnRelationships(
              modelConfig,
              formik,
              //@ts-ignore
              values,
              data
            );

            updateSimpleModelsBasedOnRelationships(
              modelConfig,
              originalSimpleModels,
              setOriginalSimpleModels,
              data,
              deletedAndNewSimpleRecords
            );

            if (!modalFormProps) {
              router.replace(prevURL);
            } else {
              modalFormProps.onSuccess();
            }
          }

          toast({
            description: `${modelConfig.verboseModelName} list updated successfully`,
            variant: "success",
            duration: 2000,
          });

          setIsUpdating(false);
        })
        .catch((err) => {
          console.log(err);
          setIsUpdating(false);
        });
    } else {
      if (addNew) {
        goToNewRecord();
      }
      setIsUpdating(false);
    }
  };

  const renderFormik = (
    formik: FormikProps<TaskTemplateFormFormikInitialValues>
  ) => {
    const handleSubmitClick: MouseEventHandler = (e) => {
      e.preventDefault();
      formik.submitForm();
    };

    return (
      <Form
        className="flex flex-col flex-1 h-full gap-4"
        autoComplete="off"
      >
        <div className="flex flex-col flex-1 h-full gap-8 xl:flex-row">
          <div className="flex flex-col flex-1 gap-4">
            <div
              className="grid grid-cols-12 gap-4"
              style={{
                gridTemplateAreas: generateGridTemplateAreas(modelConfig),
              }}
            >
              <FormikFormControlGenerator
                modelConfig={modelConfig}
                options={{
                  requiredList,
                  setHasUpdate: handleHasUdpate,
                  onChange: {
                    /*
                    finishDateTime: (newValue) => {
                      if (newValue) {
                        formik.setFieldValue("isFinished", true);
                      } else {
                        formik.setFieldValue("isFinished", false);
                      }
                    },
                    isFinished: (newValue) => {
                      if (newValue) {
                        formik.setFieldValue(
                          "finishDateTime",
                          toValidDateTime(new Date())
                        );
                      } else {
                        formik.setFieldValue("finishDateTime", "");
                      }
                    },
                    */
                  },
                  hiddenField,
                }}
                ref={ref}
              />
            </div>
            <FormikSubformGenerator
              modelConfig={modelConfig}
              formik={formik}
              handleHasUdpate={handleHasUdpate}
              /*
              //Get only the blank files from the original value
                filterFunction={(item) => !item.file}
              */
            />
            <ModelDropzonesForRelationships
              formik={formik}
              handleHasUpdate={handleHasUdpate}
              modelConfig={modelConfig}
            />
          </div>
        </div>
        <div className={cn("flex gap-2 mt-auto", modalFormProps && "pt-8")}>
          <Button
            type="button"
            size={"sm"}
            variant={"secondary"}
            onClick={(e) => {
              formik.setFieldValue("addNew", true);
              handleSubmitClick(e);
            }}
            isLoading={isUpdating}
          >
            Save & Add New
          </Button>
          <Button
            type="button"
            size={"sm"}
            variant={"secondary"}
            onClick={(e) => {
              formik.setFieldValue("addNew", false);
              handleSubmitClick(e);
            }}
            isLoading={isUpdating}
          >
            Save
          </Button>
          {modalFormProps ? null : (
            <Button
              type="button"
              size={"sm"}
              variant={"ghost"}
              onClick={(e) => {
                e.preventDefault();
                router.push(prevURL);
              }}
            >
              Back
            </Button>
          )}

          {(id !== "new" ||
            recordName !== "New " + modelConfig.verboseModelName) && (
            <Button
              type="button"
              size={"sm"}
              variant={"destructive"}
              onClick={(e) => {
                setRecordsToDelete([
                  //@ts-ignore
                  formik.values[primaryKeyField].toString(),
                ]);
              }}
              className={"ml-auto"}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </Form>
    );
  };

  useEffect(() => {
    setMounted(true);
    handleFocus();
  }, []);

  return mounted ? (
    <>
      {!modalFormProps ? (
        <Breadcrumb
          links={[
            { name: modelConfig.pluralizedVerboseModelName, href: prevURL },
            { name: recordName, href: "" },
          ]}
        />
      ) : null}

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormikSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={false}
        validationSchema={ModelSchema(modelConfig)}
      >
        {renderFormik}
      </Formik>
      <ModelDeleteDialog
        modelConfig={modelConfig}
        recordsToDelete={recordsToDelete}
        setRecordsToDelete={setRecordsToDelete}
        onSuccess={() => {
          toast({
            description:
              modelConfig.verboseModelName + " successfully deleted.",
            variant: "success",
            duration: 4000,
          });
          router.replace(prevURL);
        }}
      />
    </>
  ) : null;
};

export default TaskTemplateForm;
