import { ArrayOfUnknownObject } from "@/interfaces/GeneralInterfaces";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { ChildSQL } from "@/interfaces/interface";
import { AppConfig } from "@/lib/app-config";
import { ModelSchema } from "@/schema/ModelSchema";
import { getInsertSQL, getUpdateSQL } from "@/utils/api/ModelLibs";
import {
  findModelPrimaryKeyField,
  findRelationshipModelConfig,
} from "@/utils/utilities";

export const getRelatedSQLs = async (
  modelConfig: ModelConfig,
  body: Record<string, unknown>
) => {
  const relationships = AppConfig.relationships.filter(
    ({ rightModelID, isSimpleRelationship, excludeInForm }) =>
      rightModelID === modelConfig.seqModelID &&
      !isSimpleRelationship &&
      !excludeInForm
  );

  const sqls: ChildSQL = {};

  for (const { seqModelRelationshipID, leftForeignKey } of relationships) {
    const leftModelConfig = findRelationshipModelConfig(
      seqModelRelationshipID,
      "LEFT"
    );

    const primaryKeyField =
      findModelPrimaryKeyField(leftModelConfig).databaseFieldName;

    const modelPayload = body[
      leftModelConfig.pluralizedModelName
    ] as ArrayOfUnknownObject;

    const insertStatements: Record<number, string> = {};
    const updateStatements: Record<number, string> = {};

    if (modelPayload && modelPayload.length > 0) {
      for (const item of modelPayload) {
        try {
          await ModelSchema(leftModelConfig).validate(item);

          const childPrimaryKeyValue = item[primaryKeyField];

          if (childPrimaryKeyValue === "") {
            insertStatements[item.index as keyof typeof insertStatements] =
              getInsertSQL(leftModelConfig, item, { fkField: leftForeignKey });
          } else {
            //TODO: Update method -> for not new only
            updateStatements[item.index as keyof typeof updateStatements] =
              getUpdateSQL(leftModelConfig, item, { fkField: leftForeignKey });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    sqls[leftModelConfig.pluralizedModelName] = {
      insertStatements,
      updateStatements,
    };
  }

  return sqls;
};
