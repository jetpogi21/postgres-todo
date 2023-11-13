//Generated by WriteToModelfilterform_tsx - ModelFilterForm.tsx
"use client";
import {
  SubTaskTemplateFormikFilter,
  SubTaskTemplateSearchParams,
} from "@/interfaces/SubTaskTemplateInterfaces";
import {
  getDefaultFilters,
  getFilterValueFromURL,
  getParamsObject,
  getSortItems,
  getSorting,
} from "@/utils/utilities";
import { encodeParams } from "@/utils/utils";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { MouseEventHandler } from "react";
import LimitSelector from "@/components/form/LimitSelector";
import FormikControl from "@/components/form/FormikControl";
import { Button } from "@/components/ui/Button";
import { isEqual } from "lodash";
import useScreenSize from "@/hooks/useScreenSize";
import { Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import SortSelector from "@/components/form/SortSelector";
import { center } from "@/lib/tailwind-combo";
import { SubTaskTemplateConfig } from "@/utils/config/SubTaskTemplateConfig";
import FilterControls from "@/components/FilterControls";
import FilterDialog from "@/components/FilterDialog";
import { BasicModel } from "@/interfaces/GeneralInterfaces";
import { useModelPageParams } from "@/hooks/useModelPageParams";
import { createRequiredModelListsForFilter } from "@/lib/createRequiredModelLists";
import { useTableProps } from "@/hooks/useTableProps";

const SubTaskTemplateFilterForm = <T,>({
  tableStates,
}: {
  tableStates: ReturnType<typeof useTableProps<T>>;
}) => {
  const config = SubTaskTemplateConfig;

  const { pathname, router, params, query } =
    useModelPageParams<SubTaskTemplateSearchParams>(config);

  const { limit } = params;

  const defaultFilters = getDefaultFilters(config.filters);

  const initialValues: SubTaskTemplateFormikFilter = getFilterValueFromURL(
    query,
    defaultFilters
  );

  const requiredList: Record<string, BasicModel[]> =
    createRequiredModelListsForFilter(config);

  //Sort related
  const sorting = getSorting(params.sort);
  const sortItems = getSortItems(config);

  const isLarge = useScreenSize("lg");

  const [mounted, setMounted] = React.useState(false);

  //Zustand stores
  const { setPage, setLastFetchedPage, setFetchCount, resetRowSelection } =
    tableStates;

  const handleFormikSubmit = (
    values: Partial<SubTaskTemplateFormikFilter>,
    formik: FormikHelpers<SubTaskTemplateFormikFilter>
  ) => {
    const params = {
      ...query,
      ...(getParamsObject(
        values,
        defaultFilters
      ) as Partial<SubTaskTemplateSearchParams>),
    };

    setFetchCount(true);
    setPage(1);
    setLastFetchedPage(1);
    resetRowSelection();
    const newURL = `${pathname}?${encodeParams(params)}`;
    router.push(newURL);
  };

  const handleLimitChange = (value: string) => {
    const params = { ...query, limit: value };
    const newURL = `${pathname}?${encodeParams(params)}`;
    router.push(newURL);
    resetRowSelection();
  };

  const handleSortChange = (sortingState: SortingState) => {
    const sortParams = sortingState
      .map((item) => {
        if (item.desc) {
          return `-${item.id}`;
        } else {
          return `${item.id}`;
        }
      })
      .join(",");

    setPage(1);
    setLastFetchedPage(1);
    resetRowSelection();
    const pageParams = { ...params, sort: sortParams };
    const newURL = `${pathname}?${encodeParams(pageParams)}`;
    router.push(newURL);
  };

  const renderFormik = (formik: FormikProps<SubTaskTemplateFormikFilter>) => {
    const filtered = isEqual(defaultFilters, formik.values);

    const handleSubmitClick: MouseEventHandler = (e) => {
      e.preventDefault();
      formik.submitForm();
    };

    const handleClearClick: MouseEventHandler = (e) => {
      e.preventDefault();
      formik.setValues(defaultFilters as SubTaskTemplateFormikFilter);
      formik.submitForm();
    };

    return (
      <Form
        className="flex gap-2"
        autoComplete="off"
      >
        <div className={cn("flex w-full gap-2", isLarge && "flex-row-reverse")}>
          {config.filters.some((filter) => filter.filterQueryName === "q") && (
            <FormikControl
              name="q"
              placeholder={`Filter ${config.pluralizedVerboseModelName}...`}
              type="Text"
            />
          )}

          {!isLarge ? (
            <FilterControls
              config={config}
              requiredList={requiredList}
            />
          ) : (
            <FilterDialog
              onClearClick={handleClearClick}
              onSubmitClick={handleSubmitClick}
              config={config}
              requiredList={requiredList}
            />
          )}
        </div>
        <Button
          type="button"
          onClick={handleSubmitClick}
          size={"sm"}
          variant={"secondary"}
          className="flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="hidden lg:inline-block">Search</span>
        </Button>
        <Button
          type="button"
          size={"sm"}
          variant={"ghost"}
          disabled={filtered}
          onClick={handleClearClick}
          className="flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          <span className="hidden lg:inline-block">Clear</span>
        </Button>
      </Form>
    );
  };

  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    mounted && (
      <div className="flex flex-col justify-between w-full gap-4 lg:flex-row">
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormikSubmit}
        >
          {renderFormik}
        </Formik>
        <div className={cn(center, "gap-2", "justify-between w-auto")}>
          <div className="lg:hidden">
            <SortSelector
              onSortChange={handleSortChange}
              sortItems={sortItems}
              sorting={sorting}
            />
          </div>
          <LimitSelector
            handleLimitChange={handleLimitChange}
            value={limit}
          />
        </div>
      </div>
    )
  );
};

export default SubTaskTemplateFilterForm;
