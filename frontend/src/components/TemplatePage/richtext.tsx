import React, { useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";

interface RichTextProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ content, onChange, className = "" }) => {
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm ${className}`}>
      <RichTextEditor
        ref={rteRef}
        extensions={[StarterKit]}
        content={content}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML());
        }}
        renderControls={() => (
          <MenuControlsContainer className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
          </MenuControlsContainer>
        )}
      />
    </div>
  );
};

export default RichText;
