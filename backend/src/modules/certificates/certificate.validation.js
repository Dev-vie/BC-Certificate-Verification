const validateIssueSingle = (req, res, next) => {
  const { recipientName, recipientId, course, grade, issueDate, templateId } = req.body;

  if (!recipientName) return res.status(400).json({ message: "recipientName is required" });
  if (!recipientId) return res.status(400).json({ message: "recipientId is required" });
  if (!course) return res.status(400).json({ message: "course is required" });
  if (!grade) return res.status(400).json({ message: "grade is required" });
  if (!issueDate) return res.status(400).json({ message: "issueDate is required" });
  if (!templateId) return res.status(400).json({ message: "templateId is required" });

  next();
};

module.exports = { validateIssueSingle };
