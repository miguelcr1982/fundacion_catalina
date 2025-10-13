"use client";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";
import { useEffect, useMemo, useState } from "react";

interface RenderDescriptionProps {
  json: JSONContent;
}

export const RenderDescription = ({ json }: RenderDescriptionProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const output = useMemo(() => {
    if (!isClient) {
      return "";
    }

    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
};
