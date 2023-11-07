import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { findRelationshipModelConfig } from "@/utils/utilities";

export const processSelectJoins = (
  query: Record<string, string>,
  dontFilter: boolean,
  modelConfig: ModelConfig,
  joinFields: string[]
) => {
  // Process joins for relationships where the current model is on the left side
  processLeftModelRelationships(query, dontFilter, modelConfig, joinFields);

  // Process joins for relationships where the current model is on the right side
  processRightModelRelationships(query, dontFilter, modelConfig, joinFields);
};

const processLeftModelRelationships = (
  query: Record<string, string>,
  dontFilter: boolean,
  modelConfig: ModelConfig,
  joinFields: string[]
) => {
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

    const {
      sql: childSQL,
      fieldAliases,
      replacements: rightModelReplacements,
      subqueryAlias,
      modelName,
      filtered,
    } = getChildModelSQL(query, dontFilter, rightModelConfig);

    replacements = { ...replacements, ...rightModelReplacements };

    fieldAliases.forEach((field) => {
      joinFields.push(`${subqueryAlias}.${field}`);
    });

    const join = createJoin(
      childSQL.sql(),
      relationship.leftForeignKey,
      `"${modelName}.${relationship.rightForeignKey}"`,
      subqueryAlias,
      "INNER"
    );

    if (filtered) {
      sql.joins.push(join);
    }

    const leftSQL = getChildModelSQL(query, true, rightModelConfig).sql;
    const leftJoin = createJoin(
      leftSQL.sql(),
      relationship.leftForeignKey,
      `"${modelName}.${relationship.rightForeignKey}"`,
      subqueryAlias,
      "LEFT"
    );

    leftJoins.push(leftJoin);
  });
};

const processRightModelRelationships = (
  query: Record<string, string>,
  dontFilter: boolean,
  modelConfig: ModelConfig,
  joinFields: string[]
) => {
  const rightModelRelationships = AppConfig.relationships.filter(
    (relationship) =>
      relationship.rightModelID === modelConfig.seqModelID &&
      !relationship.excludeInTable &&
      !relationship.excludeInForm
  );

  rightModelRelationships.forEach((relationship) => {
    const leftModelConfig = findRelationshipModelConfig(
      relationship.seqModelRelationshipID,
      "LEFT"
    );

    const leftModelField = findLeftForeignKeyField(
      relationship.seqModelRelationshipID
    );

    const {
      sql: childSQL,
      fieldAliases,
      replacements: leftModelReplacements,
      subqueryAlias,
      modelName,
      filtered,
    } = getChildModelSQL(query, dontFilter, leftModelConfig);

    replacements = { ...replacements, ...leftModelReplacements };

    fieldAliases.forEach((field) => {
      joinFields.push(`${subqueryAlias}.${field}`);
    });

    const join = createJoin(
      childSQL.sql(),
      relationship.rightForeignKey,
      `"${modelName}.${leftModelField.fieldName}"`,
      subqueryAlias,
      "INNER"
    );

    if (filtered) {
      sql.joins.push(join);
    }

    const leftSQL = getChildModelSQL(query, true, leftModelConfig).sql;
    const leftJoin = createJoin(
      leftSQL.sql(),
      relationship.rightForeignKey,
      `"${modelName}.${leftModelField.fieldName}"`,
      subqueryAlias,
      "LEFT"
    );

    leftJoins.push(leftJoin);
  });
};
