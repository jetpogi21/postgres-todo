import { ModelConfig } from "@/interfaces/ModelConfig";
import { ChildSQL } from "@/interfaces/interface";
import { AppConfig } from "@/lib/app-config";
import { getInsertSQL } from "@/utils/api/ModelLibs";
import { findConfigItem, findRelationshipModelConfig } from "@/utils/utilities";

export const getRelatedSimpleSQLs = (
  modelConfig: ModelConfig,
  body: Record<string, string>
): ChildSQL => {
  const relationships = AppConfig.relationships.filter(
    ({ rightModelID, isSimpleRelationship, excludeInForm }) =>
      rightModelID === modelConfig.seqModelID &&
      isSimpleRelationship &&
      !excludeInForm
  );

  const sqls: ChildSQL = {};

  relationships.map(
    ({ seqModelRelationshipID, fieldToBeInserted, leftForeignKey }) => {
      const leftModelConfig = findRelationshipModelConfig(
        seqModelRelationshipID,
        "LEFT"
      );

      const throughModelConfig = findRelationshipModelConfig(
        seqModelRelationshipID,
        "TROUGH"
      );

      //@ts-ignore
      const newIDs: number[] =
        body[`new${throughModelConfig.pluralizedVerboseModelName}`];

      const rows = newIDs.map((item) => {
        return getInsertSQL(
          leftModelConfig,
          { [fieldToBeInserted!]: item },
          { fkField: leftForeignKey }
        );
      });

      sqls[leftModelConfig.pluralizedModelName] = {
        insertStatements: rows,
        updateStatements: {},
      };
    }
  );

  return sqls;
};
