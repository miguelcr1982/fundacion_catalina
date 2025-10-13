"use client";

import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { Menubar } from "./menubar";

interface RichTextEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
}

export const RichTextEditor = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  field,
}: RichTextEditorProps<TFieldValues, TName>) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());
      field.onChange(content);
    },
    content: field.value ? JSON.parse(field.value as string) : "<p></p>",
  });

  return (
    <div className="border-input dark:bg-input/30 w-full overflow-hidden rounded-lg border">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
