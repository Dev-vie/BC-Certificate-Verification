const templateService = require("./template.service");

const createTemplate = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Template file is required" });
    if (!req.body.title)
      return res.status(400).json({ message: "Title is required" });
    if (!req.body.placeholders)
      return res.status(400).json({ message: "Placeholders are required" });

    const template = await templateService.createTemplate(
      req.institution.id,
      req.body,
      req.file,
    );
    return res
      .status(201)
      .json({ message: "Template uploaded successfully", template });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await templateService.getTemplates(req.institution.id);
    return res.status(200).json({ templates });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const updateTemplatePlaceholders = async (req, res) => {
  try {
    if (!req.body.placeholders) {
      return res.status(400).json({ message: "Placeholders are required" });
    }

    const template = await templateService.updateTemplatePlaceholders(
      Number(req.params.id),
      req.institution.id,
      req.body.placeholders,
    );
    return res
      .status(200)
      .json({ message: "Template updated successfully", template });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    await templateService.deleteTemplate(
      Number(req.params.id),
      req.institution.id,
    );
    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplatePlaceholders,
  deleteTemplate,
};
