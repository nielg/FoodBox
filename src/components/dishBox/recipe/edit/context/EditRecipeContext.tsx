import { createContext, useContext, useState, type ReactNode } from "react";
import {
  CreateRecipeSchema,
  type CreateRecipeBody,
  type RecipeResponse,
} from "@/types/recipe/recipe.schemas";
import type { RecipeProgress } from "@/types/recipe/recipe.types";
import type { FormDataType } from "./editRecipeContex.types";

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "preview",
];

type listItem = "ingredients" | "instructions" | "imgurls";

interface EditRecipeContextType {
  formData: FormDataType;
  updateField: <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => void;
  addListItem: (list: listItem, id: number, value?: string) => void;
  updateListItem: (listName: listItem, index: number, value: string) => void;
  deleteListItem: (list: listItem, id: number) => void;
  progress: RecipeProgress;
  currentIndex: number;
  setProgress: (step: RecipeProgress) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  submit: () => void;
  isValid: () => CreateRecipeBody | null;
  loadFormData: (recipe: RecipeResponse) => void;
  isNew: boolean;
}

const EditRecipeContext = createContext<EditRecipeContextType | undefined>(
  undefined,
);

export function EditRecipeProvider({ children }: { children: ReactNode }) {
  const [isNew, setIsNew] = useState(true);
  const [progress, setProgress] = useState<RecipeProgress>("intro");
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    portions: 4,
    ingredients: [],
    instructions: [],
    tags: [],
    public: false,
    imgurls: [],
    id: undefined,
  });

  /**
   * Loads recipe json from back-end into react state
   * @param recipe
   */
  const loadFormData = (recipe: RecipeResponse) => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      portions: recipe.portions,
      ingredients: recipe.ingredients.map((item, index) => ({
        id: index,
        value: item,
      })),
      instructions: recipe.instructions.map((item, index) => ({
        id: index,
        value: item,
      })),
      tags: recipe.tags,
      public: recipe.public,
      imgurls:
        recipe.imgurls?.map((url, index) => ({ id: index, value: url })) || [],
      id: recipe.id,
    });
    setIsNew(false);
  };

  const updateField = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Add a new item to a list from the formdata state
   * @param list
   * @param id
   * @param value
   */
  const addListItem = (list: listItem, id: number, value?: string) => {
    setFormData((prev) => ({
      ...prev,
      [list]: [...prev[list], { id, value: value ?? "" }],
    }));
  };

  /**
   * Changes a item of a list from the formdata state
   * @param listName
   * @param id
   * @param value
   */
  const updateListItem = (listName: listItem, id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item) =>
        item.id === id ? { ...item, value } : item,
      ),
    }));
  };

  /**
   * Removes a item from the formdata state
   * @param listName
   * @param id
   */
  const deleteListItem = (listName: listItem, id: number) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((item) => item.id !== id),
    }));
  };

  //
  // Progress bar logic
  //
  const currentIndex = STEPS.indexOf(progress);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setProgress(STEPS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setProgress(STEPS[currentIndex + 1]);
    }
  };

  /**
   * Validates the formdate using zod
   * @returns validated object | null
   */
  const isValid = (): CreateRecipeBody | null => {
    const recipeRequest = {
      title: formData.title,
      description: formData.description,
      portions: formData.portions,
      ingredients: formData.ingredients
        .filter((item) => item.value.trim())
        .map((item) => item.value),
      instructions: formData.instructions
        .filter((item) => item.value.trim())
        .map((item) => item.value),
      tags: formData.tags,
      public: formData.public,
      imgurls: formData.imgurls.map((item) => item.value),
    };
    const result = CreateRecipeSchema.safeParse(recipeRequest);

    return result.success ? result.data : null;
  };

  /**
   * Chooses path based on if the recipe is edited or new
   * @returns
   */
  const submit = async () => {
    const body = isValid();
    if (!body) return;

    if (isNew) {
      addNewRecipe(body);
    } else {
      editExistingRecipe(body);
    }
  };

  /**
   * Create new Recipe
   * @param body
   */
  const addNewRecipe = async (body: CreateRecipeBody) => {
    try {
      const response = await fetch("/api/recipe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.location.href = `/dishBox`;
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error || "Failed to create recipe"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the recipe.");
    }
  };

  /**
   * Update existing recipe
   * @param body
   */
  const editExistingRecipe = async (body: CreateRecipeBody) => {
    try {
      const response = await fetch(`/api/recipe/${formData.id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.location.href = `/dishBox/${formData.id}`;
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error || "Failed to update recipe"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the recipe.");
    }
  };

  return (
    <EditRecipeContext.Provider
      value={{
        formData,
        updateField,
        addListItem,
        updateListItem,
        deleteListItem,
        progress,
        currentIndex,
        setProgress,
        handleNext,
        handlePrevious,
        submit,
        isValid,
        loadFormData,
        isNew,
      }}
    >
      {children}
    </EditRecipeContext.Provider>
  );
}

export const useEditRecipe = () => {
  const context = useContext(EditRecipeContext);
  if (!context) {
    throw new Error("useEditRecipe must be used within an EditRecipeProvider");
  }
  return context;
};
