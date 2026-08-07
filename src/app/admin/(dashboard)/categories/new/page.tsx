import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Nouvelle catégorie</h1>
      <p className="text-neutral-500 mb-6">Ajoutez une nouvelle catégorie à votre catalogue.</p>
      <CategoryForm action={createCategory} />
    </div>
  );
}
