//Generated by WriteToDetailPageNext13 - Detail Page Sidebar supabase
import RouterRefresh from "@/components/RouterRefresh";
import TaskCategoryForm from "@/components/task-categories/TaskCategoryForm";
import { createSupabaseServer } from "@/lib/supabase/supabase";
import { getMainModelURL } from "@/utils/api/getMainModelURL";
import { TaskCategoryConfig } from "@/utils/config/TaskCategoryConfig";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const modelConfig = TaskCategoryConfig;

export const metadata = {
  title: modelConfig.verboseModelName + " Form",
};

const TaskCategoryFormPage = async ({ params }: { params: { id: string } }) => {
  let data = null;

  const cookieStore = cookies();

  if (params.id !== "new") {
    const supabase = createSupabaseServer(cookieStore);

    const supQuery = getMainModelURL({}, true, modelConfig, supabase, {
      primaryKeyValue: params.id,
      useSlug: !!modelConfig.slugField,
    });

    try {
      const { data: result, error } = await supQuery.single();

      if (error) {
        console.log(error);
        throw notFound();
      }

      data = result;
    } catch (e) {
      console.log(e);
      throw notFound();
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full mx-auto text-sm lg:px-0 main-height-less-footer">
      <div className="flex flex-col w-full h-full gap-4 pl-4">
        <div className="flex flex-col h-full">
          <TaskCategoryForm
            id={params.id}
            data={data}
          />
          <RouterRefresh />
        </div>
      </div>
    </div>
  );
};

export default TaskCategoryFormPage;
