import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { generateQFields, getChildModelSQL } from "@/utils/api/utils";
import {
  findConfigItemObject,
  findLeftForeignKeyField,
  findRelationshipModelConfig,
} from "@/utils/utilities";

export const processURLFilters = (
  filters: string[],
  query: Record<string, string>,
  modelConfig: ModelConfig,
  replacements: Record<string, string>,
  parentMode?: boolean
) => {
  const table = modelConfig.tableName;

  ///people?grade=gte.90&student=is.true&or=(age.eq.14,not.and(age.gte.11,age.lte.17))

  if (parentMode) {
    const q = query.q;
    if (q) {
      const fields: string[] = generateQFields(modelConfig);
      filters.push(
        `or(${fields.map((field) => `${field}.ilike.*${q}*`).join(",")})`
      );
    }
  }

  modelConfig.filters
    .filter(({ filterQueryName }) => filterQueryName !== "q")
    .sort((a, b) => a.filterOrder - b.filterOrder)
    .forEach(
      ({
        filterQueryName,
        filterOperator,
        seqModelFieldID,
        seqModelRelationshipID,
        options,
      }) => {
        let queryValue = query[filterQueryName];

        const field = seqModelFieldID
          ? findConfigItemObject(
              modelConfig.fields,
              "seqModelFieldID",
              seqModelFieldID
            )
          : undefined;
        /* const field = modelConfig.fields.find(
          (field) => field.seqModelFieldID === seqModelFieldID
        )!; */
        const databaseFieldName = field?.databaseFieldName;
        const dataType = field?.dataType;

        const isBetweenDatesFilter =
          dataType === "DATEONLY" && filterOperator === "Between";

        if (queryValue || isBetweenDatesFilter) {
          if (filterOperator === "Equal" && dataType === "BOOLEAN" && options) {
            if (queryValue === options[0].fieldValue) {
              filters.push(`${databaseFieldName}.is.true`);
            } else {
              filters.push(`${databaseFieldName}.not.is.true`);
            }

            return;
          }

          if (filterOperator === "Equal") {
            filters.push(`${databaseFieldName}.eq.${filterQueryName}`);
            return;
          }

          if (isBetweenDatesFilter) {
            const dateFromName = `${filterQueryName}From`;
            const dateToName = `${filterQueryName}To`;
            const dateFrom = query[dateFromName];
            const dateTo = query[dateToName];

            if (dateFrom && dateTo) {
              filters.push(
                `${filterQueryName}.gte.${dateFrom},${filterQueryName}.lte.${dateTo}`
              );
            }

            return;
          }

          if (filterOperator === "Not is Null") {
            filters.push(`${table}.${databaseFieldName}.is.null`);
            return;
          }

          if (filterOperator === "Is Null") {
            filters.push(`${table}.${databaseFieldName}.not.is.null`);
            return;
          }

          //This is pending
          /* if (
            filterOperator === "isPresent" &&
            queryValue === "true" &&
            seqModelRelationshipID
          ) {
            const modelRelationship = findConfigItemObject(
              AppConfig.relationships,
              "seqModelRelationshipID",
              seqModelRelationshipID
            );

            const relatedModelConfig = findRelationshipModelConfig(
              seqModelRelationshipID,
              "LEFT"
            );

            const leftForeignKeyField = findLeftForeignKeyField(
              seqModelRelationshipID
            );

            const relatedModelSQL = getChildModelSQL(
              query,
              false,
              relatedModelConfig
            );

            sql.joins = [relatedModelJoin];
            return;
          } */
        }
      }
    );
};
