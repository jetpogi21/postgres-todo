import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { findRelationshipModelConfig } from "@/utils/utilities";

export const getRelatedTableFields = (modelConfig: ModelConfig) => {
  const columns: string[] = [];
  //TO DO: should produce
  //cities (name) --> to include foreign table
  //teams (name) --> through
  //from:sender_id(name), to: receiver_id(name); -> same table multiple times
  //countries!inner(name) -> inner join
  //countries!inner() -> inner join but don't return the related model

  //get relationship where the model is on the left side
  const leftModelRelationships = AppConfig.relationships.filter(
    (relationship) =>
      relationship.leftModelID === modelConfig.seqModelID &&
      !relationship.excludeInTable
  );

  leftModelRelationships.forEach((relationship) => {
    const rightModelConfig = findRelationshipModelConfig(
      relationship.seqModelRelationshipID,
      "RIGHT"
    );

    let column = "";
    const { modelName, tableName, fields } = rightModelConfig;

    //normally you would add related here.
    const fieldStr = fields.map(
      ({ databaseFieldName, fieldName }) => `${fieldName}:${databaseFieldName}`
    );
    column += `${modelName}:${tableName}(${fieldStr})`;
    //Get the fields
    //Get the pluralizedModelName, tableName
    columns.push(column);
  });

  return columns;
};
