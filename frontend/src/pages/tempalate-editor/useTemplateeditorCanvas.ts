import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTemplatesQuery,
  useUpdateTemplatePlaceholdersMutation,
} from "../../redux/features/template/templateAPI";
import { renderTemplatePreview } from "../../utils/templateAssets";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_STEP,
  FIELD_DEFS,
  FONT_OPTIONS,
  clamp,
  createField,
  type CanvasField,
} from "./templateEditorConstants";

export function useTemplateEditorCanvas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasFieldsRef = useRef<CanvasField[]>([]);
  const dragStateRef = useRef<{
    fieldId: string;
    startClientX: number;
    startClientY: number;
    offsetLogicalX: number;
    offsetLogicalY: number;
    hasMoved: boolean;
  } | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const dragUpdateRef = useRef<{
    fieldId: string;
    x: number;
    y: number;
  } | null>(null);
  const zoomRef = useRef(1);

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    isError: isTemplatesError,
  } = useGetTemplatesQuery();
  const template = templates?.find((t) => String(t.id) === id) ?? null;

  const [updateTemplatePlaceholders, { isLoading: isSaving }] =
    useUpdateTemplatePlaceholdersMutation();

  const [activeTab, setActiveTab] = useState<"canvas" | "preview" | "email">(
    "canvas",
  );
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  const [hasLoadedFields, setHasLoadedFields] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [fontSearch, setFontSearch] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>(
    "Congratulations [Recipient Name]! Your Certificate for [Course / Program] Has Been Issued",
  );
  const [emailContent, setEmailContent] = useState<string>(
    "<p>Dear [Recipient Name],</p><p>Congratulations! Your official certificate for <strong>[Course / Program]</strong> has been issued and anchored on the blockchain.</p>",
  );
  const [templateBackgroundUrl, setTemplateBackgroundUrl] = useState<
    string | null
  >(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    canvasFieldsRef.current = canvasFields;
  }, [canvasFields]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (!template || hasLoadedFields) return;

    if (template.placeholders) {
      if (Array.isArray(template.placeholders)) {
        if (template.placeholders.length > 0) {
          setCanvasFields(template.placeholders);
        }
      } else if (typeof template.placeholders === "object") {
        const p = template.placeholders as {
          fields?: CanvasField[];
          emailSubject?: string;
          emailContent?: string;
        };
        if (Array.isArray(p.fields)) setCanvasFields(p.fields);
        if (p.emailSubject) setEmailSubject(p.emailSubject);
        if (p.emailContent) setEmailContent(p.emailContent);
      }
    }
    setHasLoadedFields(true);
  }, [template, hasLoadedFields]);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    const loadTemplateAsset = async () => {
      setPreviewError(null);

      if (!template?.templateFileUrl) {
        setTemplateBackgroundUrl(null);
        return;
      }

      try {
        const previewUrl = await renderTemplatePreview(
          template.templateFileUrl,
        );
        if (cancelled) return;

        if (previewUrl.startsWith("blob:")) {
          objectUrl = previewUrl;
        }
        setTemplateBackgroundUrl(previewUrl);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to render template preview:", err);
        setTemplateBackgroundUrl(null);
        setPreviewError(
          "Could not load the certificate PDF preview. The design canvas will still work — positions are saved by coordinate, not by what you see here.",
        );
      }
    };

    void loadTemplateAsset();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [template?.templateFileUrl]);

  const [past, setPast] = useState<CanvasField[][]>([]);
  const [future, setFuture] = useState<CanvasField[][]>([]);
  const dragStartSnapshotRef = useRef<CanvasField[] | null>(null);

  const pushHistory = (previousFields: CanvasField[]) => {
    setPast((prev) => [...prev.slice(-39), previousFields]);
    setFuture([]);
  };

  const handleUndo = () => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, -1);
      setFuture((f) => [canvasFieldsRef.current, ...f.slice(0, 39)]);
      setCanvasFields(previous);
      return newPast;
    });
  };

  const handleRedo = () => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);
      setPast((p) => [...p.slice(-39), canvasFieldsRef.current]);
      setCanvasFields(next);
      return newFuture;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      const canvasElement = canvasRef.current;

      if (!dragState || !canvasElement) return;

      const dist = Math.hypot(
        event.clientX - dragState.startClientX,
        event.clientY - dragState.startClientY,
      );
      if (!dragState.hasMoved && dist < 4) {
        return;
      }
      dragState.hasMoved = true;

      const canvasRect = canvasElement.getBoundingClientRect();
      const field = canvasFieldsRef.current.find(
        (item) => item.id === dragState.fieldId,
      );
      if (!field || canvasRect.width === 0 || canvasRect.height === 0) return;

      const currentZoom = zoomRef.current || 1;
      const pointerLogicalX =
        (event.clientX - canvasRect.left) / currentZoom;
      const pointerLogicalY =
        (event.clientY - canvasRect.top) / currentZoom;

      const rawNextX = pointerLogicalX - dragState.offsetLogicalX;
      const rawNextY = pointerLogicalY - dragState.offsetLogicalY;
      const maxX = CANVAS_WIDTH - field.width;
      const maxY = CANVAS_HEIGHT - field.height;

      dragUpdateRef.current = {
        fieldId: dragState.fieldId,
        x: clamp(rawNextX, 0, maxX),
        y: clamp(rawNextY, 0, maxY),
      };

      if (dragFrameRef.current !== null) return;

      dragFrameRef.current = window.requestAnimationFrame(() => {
        const pendingUpdate = dragUpdateRef.current;
        dragFrameRef.current = null;

        if (!pendingUpdate) return;

        setCanvasFields((fields) =>
          fields.map((item) =>
            item.id === pendingUpdate.fieldId
              ? { ...item, x: pendingUpdate.x, y: pendingUpdate.y }
              : item,
          ),
        );
      });
    };

    const handlePointerUp = () => {
      const dragState = dragStateRef.current;
      const pendingUpdate = dragUpdateRef.current;

      if (dragState && dragState.hasMoved && pendingUpdate) {
        setCanvasFields((fields) =>
          fields.map((item) =>
            item.id === pendingUpdate.fieldId
              ? { ...item, x: pendingUpdate.x, y: pendingUpdate.y }
              : item,
          ),
        );

        if (dragStartSnapshotRef.current) {
          const snapshot = dragStartSnapshotRef.current;
          const current = canvasFieldsRef.current;
          const hasChanged = current.some((f) => {
            const prev = snapshot.find((s) => s.id === f.id);
            return !prev || prev.x !== f.x || prev.y !== f.y;
          });
          if (hasChanged) {
            pushHistory(snapshot);
          }
        }
      }

      dragStartSnapshotRef.current = null;
      dragStateRef.current = null;
      dragUpdateRef.current = null;

      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
    };
  }, []);

  const handleAddField = (
    fieldId: string,
    name: string,
    position?: { x: number; y: number },
  ) => {
    if (canvasFields.some((f) => f.id === fieldId)) return;

    pushHistory(canvasFields);
    setCanvasFields([
      ...canvasFields,
      createField(fieldId, name, canvasFields.length, position),
    ]);
    setSelectedFieldId(fieldId);
  };

  const handleCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const fieldId =
      event.dataTransfer.getData("application/x-template-field") ||
      event.dataTransfer.getData("text/plain");
    const field = FIELD_DEFS.find((item) => item.id === fieldId);
    const canvasElement = canvasRef.current;

    if (!field || !canvasElement) return;

    const canvasRect = canvasElement.getBoundingClientRect();
    const x = (event.clientX - canvasRect.left) / zoom;
    const y = (event.clientY - canvasRect.top) / zoom;
    const existingField = canvasFieldsRef.current.find(
      (item) => item.id === fieldId,
    );

    if (existingField) {
      pushHistory(canvasFields);
      setSelectedFieldId(fieldId);
      setCanvasFields((fields) =>
        fields.map((item) =>
          item.id === fieldId
            ? {
                ...item,
                x: clamp(x - item.width / 2, 0, CANVAS_WIDTH - item.width),
                y: clamp(y - item.height / 2, 0, CANVAS_HEIGHT - item.height),
              }
            : item,
        ),
      );
      return;
    }

    handleAddField(field.id, field.name, {
      x: clamp(x - 60, 0, CANVAS_WIDTH - (field.id === "qrCode" ? 120 : 360)),
      y: clamp(y - 24, 0, CANVAS_HEIGHT - (field.id === "qrCode" ? 120 : 48)),
    });
  };

  const handleZoomIn = () => {
    setZoom((current) =>
      Math.min(ZOOM_MAX, Math.round((current + ZOOM_STEP) * 100) / 100),
    );
  };

  const handleZoomOut = () => {
    setZoom((current) =>
      Math.max(ZOOM_MIN, Math.round((current - ZOOM_STEP) * 100) / 100),
    );
  };

  const handleZoomReset = () => setZoom(1);

  const handleFieldPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    fieldId: string,
  ) => {
    if (event.button !== 0) return;
    if (!canvasRef.current) return;

    event.stopPropagation();

    dragStartSnapshotRef.current = canvasFieldsRef.current;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentZoom = zoomRef.current || 1;
    const pointerLogicalX = (event.clientX - canvasRect.left) / currentZoom;
    const pointerLogicalY = (event.clientY - canvasRect.top) / currentZoom;

    const field = canvasFieldsRef.current.find((item) => item.id === fieldId);
    const fieldX = field ? field.x : 0;
    const fieldY = field ? field.y : 0;

    dragStateRef.current = {
      fieldId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      offsetLogicalX: pointerLogicalX - fieldX,
      offsetLogicalY: pointerLogicalY - fieldY,
      hasMoved: false,
    };
    setSelectedFieldId(fieldId);
  };

  const handleRemoveField = (fieldId: string) => {
    pushHistory(canvasFields);
    setCanvasFields(canvasFields.filter((f) => f.id !== fieldId));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const updateField = (updates: Partial<CanvasField>) => {
    if (!selectedFieldId) return;
    pushHistory(canvasFields);
    setCanvasFields((fields) =>
      fields.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f)),
    );
  };

  const toggleSidebar = () => setIsSidebarCollapsed((current) => !current);
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  const selectedField = canvasFields.find((f) => f.id === selectedFieldId);
  const hasUploadedTemplate = Boolean(templateBackgroundUrl);
  const filteredFontOptions = FONT_OPTIONS.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase()),
  );

  const handleSave = async () => {
    if (!template) return;

    try {
      setSaveError(null);
      const placeholdersPayload = {
        fields: canvasFields,
        emailSubject,
        emailContent,
      };
      await updateTemplatePlaceholders({
        id: template.id,
        placeholders: placeholdersPayload,
        fieldsCount: canvasFields.length,
      }).unwrap();
      navigate("/templates");
    } catch (err) {
      console.error("Failed to save placeholders:", err);
      setSaveError("Couldn't save your changes. Please try again.");
    }
  };

  return {

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
    openPreview,
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
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
