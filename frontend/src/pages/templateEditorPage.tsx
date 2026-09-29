import { Link } from "react-router-dom";
import { useTemplateEditorCanvas } from "./tempalate-editor/useTemplateeditorCanvas";
import { TemplateEditorHeader } from "./tempalate-editor/TemplateEditorHeader";
import { TemplateFieldsSidebar } from "./tempalate-editor/TemplateFieldsSidebar";
import { TemplateCanvasArea } from "./tempalate-editor/TemplateCanvasArea";
import { TemplateFieldStylesPanel } from "./tempalate-editor/TemplateFieldStylesPanel";
import { TemplateEmailTab } from "./tempalate-editor/TemplateEmailTab";
import { TemplatePreviewTab } from "./tempalate-editor/TemplatePreviewTab";
import { TemplatePreviewModal } from "./tempalate-editor/TemplatePreviewModal";

export default function TemplateEditorPage() {
  const {
    template,
    isLoadingTemplates,
    isTemplatesError,
    isSaving,
    saveError,
    handleSave,
    activeTab,
    setActiveTab,
    canvasRef,
    canvasFields,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    handleAddField,
    handleRemoveField,
    handleCanvasDrop,
    handleFieldPointerDown,
    updateField,
    hasUploadedTemplate,
    templateBackgroundUrl,
    previewError,
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    isSidebarCollapsed,
    toggleSidebar,
    isPreviewOpen,
    closePreview,
    fontSearch,
    setFontSearch,
    filteredFontOptions,
    emailSubject,
    setEmailSubject,
    emailContent,
    setEmailContent,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useTemplateEditorCanvas();

  if (isLoadingTemplates) {
    return (
      <div className="flex p-8 justify-center items-center h-screen bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (isTemplatesError) {
    return (
      <div className="flex flex-col gap-3 p-8 justify-center items-center h-screen bg-background text-foreground">
        <p className="text-sm text-rose-500">
          Couldn't load this template. Please try again.
        </p>
        <Link
          to="/templates"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to Templates
        </Link>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col gap-3 p-8 justify-center items-center h-screen bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Template not found.</p>
        <Link
          to="/templates"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <TemplateEditorHeader
        templateTitle={template.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        isSaving={isSaving}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {saveError && (
        <div className="px-6 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-500 text-xs font-medium text-center">
          {saveError}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {activeTab === "canvas" ? (
          <>
            <TemplateFieldsSidebar
              canvasFields={canvasFields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
              isCollapsed={isSidebarCollapsed}
            />

            <TemplateCanvasArea
              canvasRef={canvasRef}
              canvasFields={canvasFields}
              selectedFieldId={selectedFieldId}
              setSelectedFieldId={setSelectedFieldId}
              onRemoveField={handleRemoveField}
              onCanvasDrop={handleCanvasDrop}
              onFieldPointerDown={handleFieldPointerDown}
              templateTitle={template.title}
              hasUploadedTemplate={hasUploadedTemplate}
              templateBackgroundUrl={templateBackgroundUrl}
              previewError={previewError}
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
            />

            <TemplateFieldStylesPanel
              selectedField={selectedField}
              updateField={updateField}
              onRemoveField={handleRemoveField}
              fontSearch={fontSearch}
              setFontSearch={setFontSearch}
              filteredFontOptions={filteredFontOptions}
            />
          </>
        ) : activeTab === "preview" ? (
          <TemplatePreviewTab
            templateTitle={template.title}
            canvasFields={canvasFields}
            hasUploadedTemplate={hasUploadedTemplate}
            templateBackgroundUrl={templateBackgroundUrl}
            onSwitchToCanvas={() => setActiveTab("canvas")}
          />
        ) : (
          <TemplateEmailTab
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            emailContent={emailContent}
            setEmailContent={setEmailContent}
          />
        )}
      </div>

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        templateTitle={template.title}
        canvasFields={canvasFields}
        hasUploadedTemplate={hasUploadedTemplate}
        templateBackgroundUrl={templateBackgroundUrl}
      />
    </div>
  );
}
