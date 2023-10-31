"use client";
import ModelSubform from "@/components/ModelSubform";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { getChildModels } from "@/lib/getChildModels";
import { findRelationshipModelConfig } from "@/utils/utilities";
import { FormikProps } from "formik";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type FormikSubformGeneratorProps<T> = {
  modelConfig: ModelConfig;
  formik: FormikProps<T>;
  handleHasUdpate: () => void;
  filterFunction?: (item: Record<string, unknown>) => boolean;
};

const FormikSubformGenerator = <T,>({
  modelConfig,
  formik,
  handleHasUdpate,
  filterFunction,
}: FormikSubformGeneratorProps<T>) => {
  return getChildModels(modelConfig, { formMode: true }).map((relationship) => {
    const leftModelConfig = findRelationshipModelConfig(
      relationship.seqModelRelationshipID,
      "LEFT"
    );

    const hasOrderField = leftModelConfig.fields.some(
      (field) => field.orderField
    );

    if (hasOrderField) {
      return (
        <DndProvider
          backend={HTML5Backend}
          key={relationship.seqModelRelationshipID}
        >
          <ModelSubform
            key={relationship.seqModelRelationshipID}
            formik={formik}
            relationshipConfig={relationship}
            setHasUpdate={handleHasUdpate}
            filterFunction={filterFunction}
          />
        </DndProvider>
      );
    } else {
      return (
        <ModelSubform
          key={relationship.seqModelRelationshipID}
          formik={formik}
          relationshipConfig={relationship}
          setHasUpdate={handleHasUdpate}
          filterFunction={filterFunction}
        />
      );
    }
  });
};

export default FormikSubformGenerator;
