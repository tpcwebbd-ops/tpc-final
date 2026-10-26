/*
|-----------------------------------------
| setting up RichTextEditor.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August, 2026
|-----------------------------------------
*/

"use client";

import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECT_ALL_COMMAND,
  UNDO_COMMAND,
  type LexicalCommand,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";
import { useMemo } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "rounded bg-stone-100 px-1 font-mono text-xs",
  },
  heading: {
    h1: "my-4 text-4xl font-bold",
    h2: "my-3 text-3xl font-bold",
    h3: "my-3 text-2xl font-bold",
    h4: "my-2 text-xl font-bold",
    h5: "my-2 text-lg font-bold",
    h6: "my-2 text-base font-bold",
  },
  quote: "my-4 border-l-4 border-amber-300 pl-4 italic text-stone-600",
  code: "my-4 overflow-x-auto rounded-sm bg-stone-950 p-4 font-mono text-sm text-stone-100",
  tableScrollableWrapper: "my-4 w-full overflow-x-auto",
  list: { ul: "my-3 list-disc pl-6", ol: "my-3 list-decimal pl-6", listitem: "my-1" },
  link: "text-amber-800 underline",
};
const emptyState = JSON.stringify({
  root: {
    children: [{ children: [], direction: null, format: "", indent: 0, type: "paragraph", version: 1 }],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});
const nodes = [
  LinkNode,
  ListNode,
  ListItemNode,
  HeadingNode,
  QuoteNode,
  HorizontalRuleNode,
  TableNode,
  TableRowNode,
  TableCellNode,
];

export function RichTextEditor({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const initialConfig = useMemo(
    () => ({
      namespace: "SpeedBoxRichText",
      editorState: value || emptyState,
      nodes,
      onError: (error: Error) => console.error(error),
      theme,
    }),
    [value],
  );
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder="Write content…"
            className="min-h-56 rounded-sm border border-[#eadfca] bg-white p-4 text-sm leading-7 outline-none"
            placeholder={<span />}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<p className="pointer-events-none absolute p-4 text-sm text-stone-400">Write content…</p>}
      />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <TablePlugin hasCellBackgroundColor hasCellMerge hasHorizontalScroll />
      <OnChangePlugin onChange={(state) => onChange(JSON.stringify(state.toJSON()))} />
    </LexicalComposer>
  );
}

export function RichTextPreview({ value }: { value?: string }) {
  const initialConfig = useMemo(
    () => ({
      editable: false,
      namespace: "SpeedBoxRichTextPreview",
      editorState: value || emptyState,
      nodes,
      onError: (error: Error) => console.error(error),
      theme,
    }),
    [value],
  );
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder="Rich text"
            className="bg-white text-sm leading-7 text-stone-700 outline-none"
            placeholder={<span />}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={null}
      />
      <ListPlugin />
      <LinkPlugin />
      <TablePlugin hasCellBackgroundColor hasCellMerge hasHorizontalScroll />
    </LexicalComposer>
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const block = (kind: string) =>
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (kind === "paragraph") $setBlocksType(selection, () => $createParagraphNode());
      else if (kind === "quote" || kind === "code") $setBlocksType(selection, () => $createQuoteNode());
      else $setBlocksType(selection, () => $createHeadingNode(kind as "h1"));
    });
  const style = (property: string, value: string) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $patchStyleText(selection, { [property]: value });
    });
  const link = () => {
    const url = window.prompt("Link URL (https://)");
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url && /^https?:\/\//i.test(url) ? url : null);
  };
  return (
    <div className="mb-2 flex flex-wrap gap-1 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-2">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton editor={editor} command={UNDO_COMMAND} label="Undo">
          ↶
        </ToolbarButton>
        <ToolbarButton editor={editor} command={REDO_COMMAND} label="Redo">
          ↷
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          command={SELECT_ALL_COMMAND as unknown as LexicalCommand<void>}
          label="Select all"
        >
          All
        </ToolbarButton>
      </div>
      <select
        aria-label="Text block"
        className="h-8 rounded-sm border bg-white px-2 text-xs"
        defaultValue="paragraph"
        onChange={(event) => block(event.target.value)}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
        <option value="quote">Blockquote</option>
        <option value="code">Code block</option>
      </select>
      <div className="flex flex-wrap gap-1">
        <ToolbarButton editor={editor} command={FORMAT_TEXT_COMMAND} payload="bold" label="Bold">
          B
        </ToolbarButton>
        <ToolbarButton editor={editor} command={FORMAT_TEXT_COMMAND} payload="italic" label="Italic">
          I
        </ToolbarButton>
        <ToolbarButton editor={editor} command={FORMAT_TEXT_COMMAND} payload="underline" label="Underline">
          U
        </ToolbarButton>
        <ToolbarButton editor={editor} command={FORMAT_TEXT_COMMAND} payload="strikethrough" label="Strikethrough">
          S
        </ToolbarButton>
        <ToolbarButton editor={editor} command={FORMAT_TEXT_COMMAND} payload="code" label="Inline code">
          &lt;/&gt;
        </ToolbarButton>
      </div>
      <input
        aria-label="Text color"
        className="h-8 w-8 cursor-pointer"
        onChange={(event) => style("color", event.target.value)}
        title="Text color"
        type="color"
      />
      <input
        aria-label="Highlight color"
        className="h-8 w-8 cursor-pointer"
        onChange={(event) => style("background-color", event.target.value)}
        title="Highlight color"
        type="color"
      />
      <select
        aria-label="Font size"
        className="h-8 rounded-sm border bg-white px-1 text-xs"
        onChange={(event) => style("font-size", event.target.value)}
      >
        <option value="">Font size</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
      </select>
      <div className="flex flex-wrap gap-1">
        <ToolbarButton editor={editor} command={INSERT_UNORDERED_LIST_COMMAND} label="Bulleted list">
          • List
        </ToolbarButton>
        <ToolbarButton editor={editor} command={INSERT_ORDERED_LIST_COMMAND} label="Numbered list">
          1. List
        </ToolbarButton>
        <ToolbarButton editor={editor} command={INDENT_CONTENT_COMMAND} label="Increase indent">
          →
        </ToolbarButton>
        <ToolbarButton editor={editor} command={OUTDENT_CONTENT_COMMAND} label="Decrease indent">
          ←
        </ToolbarButton>
      </div>
      <select
        aria-label="Alignment"
        className="h-8 rounded-sm border bg-white px-1 text-xs"
        defaultValue=""
        onChange={(event) =>
          event.target.value && editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, event.target.value as "left")
        }
      >
        <option value="">Align</option>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="justify">Justify</option>
      </select>
      <Button onClick={link} size="sm" title="Add or remove link" type="button" variant="outline">
        {iconMap.Link}
      </Button>
    </div>
  );
}

function ToolbarButton({
  editor,
  command,
  label,
  payload,
  children,
}: {
  editor: LexicalEditor;
  command: LexicalCommand<void> | LexicalCommand<TextFormatType>;
  label: string;
  payload?: TextFormatType;
  children: React.ReactNode;
}) {
  return (
    <Button
      aria-label={label}
      className="cursor-pointer transition duration-700 hover:bg-amber-100"
      onClick={() => editor.dispatchCommand(command as never, payload as never)}
      size="sm"
      type="button"
      variant="outline"
    >
      {children}
    </Button>
  );
}
