// src/components/editor/StateEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Toolbar } from "./ToolBar";
import { useState, useEffect } from "react";
import { Pencil, Save, X } from "lucide-react";

interface StateEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export const StateEditor = ({ initialContent, onSave }: StateEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
  });

  // Důležité: Aktualizujeme editable stav editoru když se změní isEditing
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  const handleSave = () => {
    if (editor) {
      onSave(editor.getHTML());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(initialContent);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        isEditing ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        {isEditing ? (
          <>
            <Toolbar editor={editor} />
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          </div>
        )}
      </div>

      <div
        className={`p-6 prose max-w-none ${
          !isEditing ? "cursor-default" : "cursor-text"
        }`}
        onClick={() => {
          if (!isEditing) setIsEditing(true);
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
