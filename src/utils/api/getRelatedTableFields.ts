import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { findRelationshipModelConfig } from "@/utils/utilities";

export const getRelatedTableFields = (
  modelConfig: ModelConfig,
  query: Record<string, string>
) => {
  const columns: string[] = [];

  const processRelationships = (
    relationships: (typeof AppConfig)["relationships"],
    side: "LEFT" | "RIGHT"
  ) => {
    relationships.forEach((relationship) => {
      const relatedModelConfig = findRelationshipModelConfig(
        relationship.seqModelRelationshipID,
        side
      );

      let column = "";
      const { modelName, tableName, fields, pluralizedModelName } =
        relatedModelConfig;
      const fieldStr = fields.map(
        ({ databaseFieldName, fieldName }) =>
          `${fieldName}:${databaseFieldName}`
      );
      const name = side === "LEFT" ? pluralizedModelName : modelName;
      column += `${name}:${tableName}(${fieldStr})`;

      modelConfig.filters
        .filter(
          (filter) =>
            filter.seqModelRelationshipID ===
            relationship.seqModelRelationshipID
        )
        .forEach((filterConfig) => {
          const { filterQueryName } = filterConfig;
          const alias = filterQueryName + modelName;
          const queryValue = query[filterQueryName];

          if (queryValue) {
            columns.push(`${alias}:${tableName}!inner()`);
          }
        });

      columns.push(column);
    });
  };

  const leftModelRelationships = AppConfig.relationships.filter(
    (relationship) =>
      relationship.leftModelID === modelConfig.seqModelID &&
      !relationship.excludeInTable
  );

  processRelationships(leftModelRelationships, "RIGHT");

  const rightModelRelationships = AppConfig.relationships.filter(
    (relationship) =>
      relationship.rightModelID === modelConfig.seqModelID &&
      !relationship.excludeInTable
  );

  processRelationships(rightModelRelationships, "LEFT");

  return columns;
};
