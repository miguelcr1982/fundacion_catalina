"use client";

import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => {
  return (
    <div className="text-center">
      <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
        <CloudUploadIcon
          className={cn(
            "text-muted-foreground size-6",
            isDragActive && "text-primary",
          )}
        />
      </div>

      <p className="text-foreground text-base font-semibold">
        Deja tus archivos o{" "}
        <span className="text-primary cursor-pointer font-bold">
          haga clic para subir
        </span>
      </p>

      <Button type="button" className="mt-4">
        Seleccionar archivo
      </Button>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className="text-center">
      <div className="bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
        <ImageIcon className={cn("text-destructive size-6")} />
      </div>

      <p className="text-base font-semibold">Error en la carga</p>

      <p className="text-muted-foreground mt-1 text-xs">algo salió mal</p>

      <Button type="button" size="sm" className="mt-4">
        Reintentar la selección de archivos
      </Button>
    </div>
  );
};

export const RenderUploadedState = ({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile(): Promise<void>;
  fileType: "image" | "video";
}) => {
  return (
    <div className="group relative flex size-full items-center justify-center">
      {fileType === "image" ? (
        <Image
          src={previewUrl}
          alt="uploaded file preview"
          className="object-contain p-2"
          fill
        />
      ) : (
        <video src={previewUrl} className="size-full rounded-md" controls />
      )}

      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveFile();
        }}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p>{progress}</p>

      <p className="text-foreground mt-2 text-sm font-medium">Subiendo...</p>

      <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs">
        {file.name}
      </p>
    </div>
  );
};
