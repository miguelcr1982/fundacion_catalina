"use client";

import { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { useConstructUrlMedia } from "@/hooks/use-construct-url";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";

interface UploaderState {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

export const Uploader = ({
  onChange,
  value,
  fileTypeAccepted,
}: UploaderProps) => {
  let fileUrl = "";

  fileUrl = useConstructUrlMedia(value || "");

  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    isUploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        isUploading: true,
        progress: 0,
      }));

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileTypeAccepted", fileTypeAccepted);

        const uploadResponse = await fetch("/api/upload-local", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          toast.error("No se pudo cargar el archivo");
          throw new Error("Error en la carga local");
        }

        const { key } = await uploadResponse.json();
        setFileState((prev) => ({
          ...prev,
          progress: 100,
          isUploading: false,
          key,
        }));

        toast.success("Archivo cargado exitosamente");
        onChange?.(key);
      } catch (error) {
        toast.error("Algo salió mal");
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          isUploading: false,
          error: true,
        }));
      }
    },
    [fileTypeAccepted, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length <= 0) return;

      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file: file,
        isUploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: fileTypeAccepted,
      });

      uploadFile(file);
    },
    [fileState.objectUrl, fileTypeAccepted, uploadFile],
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // If there is no uploaded `key` (e.g. local blob preview), skip server delete.
      if (!fileState.key) {
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        onChange?.("");

        setFileState(() => ({
          file: null,
          isUploading: false,
          progress: 0,
          objectUrl: undefined,
          error: false,
          fileType: fileTypeAccepted,
          id: null,
          isDeleting: false,
        }));

        toast.success("Archivo eliminado exitosamente");
        return;
      }

      const response = await fetch("/api/delete-local", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error("No se pudo eliminar el archivo");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));

        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        isUploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
      }));

      toast.success("Archivo eliminado exitosamente");
    } catch {
      toast.error("Error al eliminar el archivo. Inténtalo de nuevo..");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );
      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (tooManyFiles) {
        toast.error("Demasiados archivos seleccionados, el máximo es 1");
      }

      if (fileSizeTooBig) {
        toast.error(
          "El tamaño del archivo excede el límite, el máximo es 5 MB para imágenes y 250 MB para videos",
        );
      }
    }
  };

  const renderContent = () => {
    if (fileState.isUploading && fileState.file) {
      return (
        <RenderUploadingState
          file={fileState.file}
          progress={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          previewUrl={fileState.objectUrl}
          fileType={fileState.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 250 * 1024 * 1024, // 5MB images, 250MB videos
    onDropRejected: rejectedFiles,
    disabled:
      !!fileState.objectUrl || fileState.isDeleting || fileState.isUploading,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full border-2 border-dashed transition-colors duration-200 ease-in-out",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex size-full items-center justify-center p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};
