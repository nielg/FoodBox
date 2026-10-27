import { useEffect, useState } from "react";
import { ImageUp } from "lucide-react";

import s from "@/styles/components/editRecipe/uploadImg.module.css";
import { UtilsUploadRecipeImg } from "@/utils/uploadRecipeImg";
import { useEditRecipe } from "./context/EditRecipeContext";
import { RecipeImg } from "./RecipeImg";

type NewImage = {
  file: File;
  previewUrl: string;
};

export default function AddRecipeImg() {
  const { formData, addListItem, deleteListItem } = useEditRecipe();

  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    formData.imgurls.map(({ value }) => value),
  );
  const [urlsToRemove, setUrlsToRemove] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * URLs displayed by RecipeImg.
   *
   * Existing images come from the server.
   * New images use local blob URLs.
   */
  const objectURLs = [
    ...existingImageUrls,
    ...newImages.map(({ previewUrl }) => previewUrl),
  ];

  const uploadFiles = (files: File[]) => {
    if (files.length === 0) return;

    const images: NewImage[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...images]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    uploadFiles(Array.from(event.target.files));

    // Allows selecting the same file again.
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    uploadFiles(Array.from(event.dataTransfer.files));
  };

  const handleDeleteImage = (index: number) => {
    const existingImageCount = existingImageUrls.length;

    // ----------------------------------------
    // Existing server image
    // ----------------------------------------
    if (index < existingImageCount) {
      const url = existingImageUrls[index];

      setUrlsToRemove((prev) => [...prev, url]);

      setExistingImageUrls((prev) =>
        prev.filter((_, imageIndex) => imageIndex !== index),
      );

      deleteListItem("imgurls", index);

      return;
    }

    // ----------------------------------------
    // Newly selected image
    // ----------------------------------------
    const newImageIndex = index - existingImageCount;
    const image = newImages[newImageIndex];

    if (!image) return;

    URL.revokeObjectURL(image.previewUrl);

    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== newImageIndex),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newImages.length === 0 && urlsToRemove.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      // ----------------------------------------
      // Upload newly selected images
      // ----------------------------------------
      if (newImages.length > 0) {
        const files = newImages.map(({ file }) => file);

        const uploadedUrls = await UtilsUploadRecipeImg.uploadImg(files);

        uploadedUrls.forEach((url) => {
          addListItem("imgurls", formData.imgurls.length, url);
        });
      }

      // ----------------------------------------
      // Delete removed existing images
      // ----------------------------------------
      if (urlsToRemove.length > 0) {
        await UtilsUploadRecipeImg.deleteImg(urlsToRemove);
      }

      // ----------------------------------------
      // Clean up local previews
      // ----------------------------------------
      newImages.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });

      setNewImages([]);
      setUrlsToRemove([]);
    } catch (error) {
      console.error("Failed to save images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Clean up blob URLs if the component unmounts.
   */
  useEffect(() => {
    return () => {
      newImages.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className={s.uploadForm}>
      <div
        className={s.uploadContainer}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <label htmlFor="imageUpload">
          <h3>Upload images:</h3>

          <p>Click to select or drag and drop files here (PNG, JPEG, WEBP)</p>

          <ImageUp size={24} />

          <input
            id="imageUpload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            hidden
            onChange={handleFileSelect}
          />
        </label>
      </div>

      <RecipeImg objectURLS={objectURLs} onDeleteImage={handleDeleteImage} />

      <button type="submit" disabled={isUploading} className={`${s.btn} btn`}>
        {isUploading ? "Uploading..." : "Save images"}
      </button>
    </form>
  );
}
