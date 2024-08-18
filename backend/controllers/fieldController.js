const mongoose = require('mongoose');
const Polygon = mongoose.model('Polygon');

exports.saveFields = async (req, res) => {
  try {
    const { polygons } = req.body;

    // Create Polygon documents for each polygon
    const polygonDocuments = polygons.map((polygon) => ({
      coordinates: polygon.path,
      name: polygon.name,
    }));

    await Polygon.insertMany(polygonDocuments);

    res.status(201).json({ message: "Polygons saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveSinglePolygon = async (req, res) => {
  const { coordinates, name, userId } = req.body;

  try {
    // Validate input
    if (!coordinates || !name || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new polygon with the userId
    const polygon = new Polygon({
      coordinates,
      name,
      userId, // Add userId to the polygon data
    });

    await polygon.save();
    res.status(200).json({ message: 'Polygon saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetDatabase = async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete polygons that match the userId
    const result = await Polygon.deleteMany({ userId });

    res.status(200).json({ message: `Database reset for user ${userId}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loadPolygons = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find polygons that match the userId
    const polygons = await Polygon.find({ userId });

    res.status(200).json(polygons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateField = async (req, res) => {
  const { name } = req.params;
  const { name: newName } = req.body;

  try {
    const polygon = await Polygon.findOne({ name });
    if (!polygon) {
      return res.status(404).json({ message: 'Field not found' });
    }

    polygon.name = newName;
    await polygon.save();

    res.status(200).json({ message: 'Field updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteField = async (req, res) => {
  const { name } = req.params;

  try {
    const result = await Polygon.deleteOne({ name });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.status(200).json({ message: 'Field deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};