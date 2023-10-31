import { ModelConfig } from "@/interfaces/ModelConfig";
import { backendModels } from "@/lib/backend-models";
import { findModelPrimaryKeyField, forceCastToNumber } from "@/utils/utilities";
import { Op } from "sequelize";
import { Transaction } from "sequelize";

const createParsedPayload = (
  modelConfig: ModelConfig,
  payload: Record<string, unknown>
) => {
  const parsedPayload: Record<string, unknown> = {};
  const payloadKeys = Object.keys(payload).map((key) => key);

  //This should also just get the fields which is on the payload since it will be replaced by a
  //default (e.g. null if it's not provided as a payload)
  //Useful for updating selected fields only.
  modelConfig.fields
    .filter(
      (field) => !field.primaryKey && payloadKeys.includes(field.fieldName)
    )
    .forEach(({ dataType, fieldName, allowNull }) => {
      const value = payload[fieldName];

      let parsedValue;
      if ((value === null || value === "") && allowNull) {
        parsedValue = null;
      } else if (value === null && dataType === "BOOLEAN") {
        parsedValue = false;
      } else if (dataType === "BIGINT") {
        parsedValue = forceCastToNumber(payload[fieldName] as string);
      } else {
        parsedValue = payload[fieldName];
      }

      parsedPayload[fieldName] = parsedValue;
    });

  return parsedPayload;
};

export const createModel = async (
  modelConfig: ModelConfig,
  payload: Record<string, unknown>,
  t: Transaction
) => {
  const parsedPayload = createParsedPayload(modelConfig, payload);
  const Model =
    backendModels[modelConfig.modelName as keyof typeof backendModels];

  //@ts-ignore
  return await Model.create(parsedPayload as any, { transaction: t });
};

export const updateModel = async (
  modelConfig: ModelConfig,
  payload: Record<string, unknown>,
  primaryKeyValue: number | string,
  t: Transaction
) => {
  const parsedPayload = createParsedPayload(modelConfig, payload);

  const primaryKeyField = findModelPrimaryKeyField(modelConfig);
  const Model =
    backendModels[modelConfig.modelName as keyof typeof backendModels];

  //@ts-ignore
  await Model.update(parsedPayload as any, {
    where: {
      [primaryKeyField.fieldName]:
        primaryKeyValue || payload[primaryKeyField.fieldName],
    },
    transaction: t,
    individualHooks: true,
  });
};

export const deleteModels = async (
  modelConfig: ModelConfig,
  deletedIds: string[] | number[],
  t: Transaction
) => {
  const primaryKeyField = findModelPrimaryKeyField(modelConfig);
  const Model =
    backendModels[modelConfig.modelName as keyof typeof backendModels];
  //@ts-ignore
  await Model.destroy({
    where: { [primaryKeyField.fieldName]: { [Op.in]: deletedIds } },
    transaction: t,
  });
};
