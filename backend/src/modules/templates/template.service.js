const prisma = require("../../prisma/prismaClient");
const { uploadFile, deleteFile } = require("../../utils/fileManager");

const createTemplate = async (institutionId, { title, placeholders }, file) => {
  const fileUrl = await uploadFile(
    file,
    process.env.SUPABASE_TEMPLATES_BUCKET,
    `institution-${institutionId}`,
  );

  const template = await prisma.template.create({
    data: {
      title,
      filePath: fileUrl,
      placeholders: JSON.parse(placeholders),
      institutionId,
    },
  });

  return template;
};

const getTemplates = async (institutionId) => {
  return await prisma.template.findMany({
    where: { institutionId },
    orderBy: { createdAt: "desc" },
  });
};

const getTemplateById = async (id, institutionId) => {
  const template = await prisma.template.findFirst({
    where: { id, institutionId },
  });
  if (!template) throw { status: 404, message: "Template not found" };
  return template;
};

const updateTemplatePlaceholders = async (id, institutionId, placeholders) => {
  const template = await prisma.template.findFirst({
    where: { id, institutionId },
  });
  if (!template) throw { status: 404, message: "Template not found" };

  const parsedPlaceholders =
    typeof placeholders === "string" ? JSON.parse(placeholders) : placeholders;

  return await prisma.template.update({
    where: { id },
    data: { placeholders: parsedPlaceholders },
  });
};

const deleteTemplate = async (id, institutionId) => {
  const template = await prisma.template.findFirst({
    where: { id, institutionId },
  });
  if (!template) throw { status: 404, message: "Template not found" };

  await deleteFile(template.filePath, process.env.SUPABASE_TEMPLATES_BUCKET);
  await prisma.template.delete({ where: { id } });
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplatePlaceholders,
  deleteTemplate,
};
