import { useMemo } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { PixelIcon } from "@/components/pixel";

import { insertCodeBlock } from "@/components/editor/extensions/code";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";

export function CodePickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "code-block",
        label: t.insertCodeBlock,
        icon: <PixelIcon name="code" size={16} className="text-muted-foreground" />,
        keywords: ["code", "codeblock", "javascript", "python", "js"],
        onSelect: () => insertCodeBlock(editor),
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
