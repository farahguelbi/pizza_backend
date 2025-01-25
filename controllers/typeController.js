// Controller function to get type by ID
const Type = require('../models/type');  // Import the Type model

exports.getTypeById = async (req, res) => {
  try {
    // Find the type by ID
    const type = await Type.findById(req.params.id);

    // Check if the type exists
    if (!type) {
      return res.status(404).json({ message: 'Type not found!' });
    }

    // Return the found type
    res.status(200).json(type);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};
