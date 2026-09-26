import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Layers, Loader2, CircleHelp } from "lucide-react";
import Sidebar from "../components/DashboardPage/sidebar";
import Header from "../components/DashboardPage/header";
import CardWithImage from "../components/TemplatePage/cardwithimage";
import CreateNewTemplate from "../components/TemplatePage/createnewtemplate";
import TemplateHowItWorksModal from "../components/TemplatePage/TemplateHowItWorksModal";
import { useTemplates } from "../hooks/useTemplate";
import { AnimatedItem } from "../components/ui/AnimatedList";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";

function TemplatePage() {
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const {
    filteredTemplates,
    totalCount,
    isLoading,
    isError,
    isUploading,
    uploadTemplate,
    deleteTemplate,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useTemplates();

  const handleCreateTemplate = async (data: { title: string; file: File }) => {
    try {

      const newTemplate = await uploadTemplate({
        title: data.title,
        file: data.file,
      });
      closeCreateModal();
      navigate(`/templates/${newTemplate.id}/edit`);
    } catch (err) {

      console.error("Failed to upload template:", err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">

      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >

        <Header />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="px-4 sm:px-8 py-6 max-w-full overflow-x-hidden"
        >

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Templates</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload certificate designs and map dynamic fields.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="inline-flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer p-1"
              >
                <CircleHelp size={18} />
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
              >
                <Plus size={16} />
                New Template
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="dashboard-stat-card group relative bg-card rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 max-w-xs">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Total Templates
                </p>
                <div className="p-2.5 rounded-xl border border-border bg-background/50 transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5">
                  <Layers size={18} className="text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-[32px] font-bold text-foreground leading-none tracking-tight">
                {totalCount}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6 gap-4">
            <div className="relative w-full max-w-xs">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full h-9 pl-10 pr-4 text-xs md:text-sm text-foreground placeholder:text-muted-foreground bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground shrink-0">
              {filteredTemplates.length}{" "}
              {filteredTemplates.length === 1 ? "template" : "templates"}
            </span>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading templates...
            </div>
          )}
          {isError && !isLoading && (
            <div className="py-16 text-center text-sm text-rose-500">
              Couldn't load templates. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <AnimatedItem key={template.id} index={index} delay={index * 0.05}>
                  <CardWithImage
                    title={template.title}
                    category={template.category}
                    status={template.status}
                    fieldsCount={template.fieldsCount}
                    date={template.date}
                    gradientClass={template.gradientClass}
                    templateFileUrl={
                      template.templateFileUrl || template.filePath
                    }
                    onClick={() => navigate(`/templates/${template.id}/edit`)}
                    onActionClick={() =>
                      navigate(`/templates/${template.id}/edit`)
                    }
                    onViewClick={() => navigate(`/templates/${template.id}/edit`)}
                    onDeleteClick={() => handleDeleteTemplate(template.id)}
                  />
                </AnimatedItem>
              ))}

              <AnimatedItem index={filteredTemplates.length} delay={filteredTemplates.length * 0.05}>
                <CardWithImage isUpload={true} onClick={openCreateModal} />
              </AnimatedItem>
            </div>
          )}

          <CreateNewTemplate
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            onSubmit={handleCreateTemplate}
            isSubmitting={isUploading}
          />
          <TemplateHowItWorksModal
            isOpen={isHowItWorksOpen}
            onClose={() => setIsHowItWorksOpen(false)}
          />
          {isUploading && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl shadow-lg text-sm text-foreground">
              <Loader2 size={16} className="animate-spin text-primary" />
              Uploading template...
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
export default TemplatePage;
