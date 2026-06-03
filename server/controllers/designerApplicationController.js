const designerApplicationService = require('../services/designerApplicationService');

const createApplication = async (req, res) => {
  const result = await designerApplicationService.createApplication(req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { createApplication };
