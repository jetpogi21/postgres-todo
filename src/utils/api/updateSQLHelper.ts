import sequelize from "@/config/db";
import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { forceCastToNumber } from "@/utils/utilities";
import { QueryTypes, Transaction } from "sequelize";

export const executeUpdateQueryFromPayload = async (
  modelConfig: ModelConfig,
  payload: Record<string, unknown>,
  primaryKeyValue: string | number,
  t: Transaction
) => {
  const replacements: Record<string, unknown> = {};
  const table = modelConfig.tableName;
  const fields: string[] = [];
  modelConfig.fields
    .filter((field) => !field.primaryKey)
    .forEach(({ dataType, fieldName, allowNull, databaseFieldName }) => {
      let value = payload[fieldName];

      let parsedValue;
      if ((typeof value === undefined || typeof value === null) && allowNull) {
        parsedValue = null;
      } else if (dataType === "BIGINT") {
        parsedValue = forceCastToNumber(payload[fieldName] as string);
      }

      fields.push(fieldName);
      replacements[fieldName] = parsedValue;
    });

  const sql = `INSERT INTO ${table} (${fields
    .map((field) => `\`${field}\``)
    .join(",")}) VALUES (${fields.map((field) => `:${field}`).join(",")})`;

  const result = await sequelize.query(sql, {
    type: QueryTypes.INSERT,
    transaction: t,
    replacements,
  });

  return result;
};
