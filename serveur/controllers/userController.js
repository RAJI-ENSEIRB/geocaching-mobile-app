const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

exports.getProfile = async (req, res) => {
  const db = getDB();
  const users = db.collection('users');
  const user = await users.findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0 } });

  if (!user) return res.status(404).json({ msg: 'Utilisateur non trouvé' });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const db = getDB();
  const users = db.collection('users');
  const { email, password } = req.body;

  const updates = {};
  if (email) updates.email = email;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updates.password = hashed;
  }

  await users.updateOne({ _id: new ObjectId(req.user.id) }, { $set: updates });
  res.json({ msg: 'Profil mis à jour' });
};

exports.getStats = async (req, res) => {
  const db = getDB();
  const caches = db.collection('caches');
  const userId = new ObjectId(req.user.id);

  try {
    const hides = await caches.countDocuments({ creator: userId });

    // À adapter plus tard si tu veux gérer des "finds" ou de la "distance"
    const stats = {
      finds: 0,
      hides: hides,
      distance: 0,
      score: hides, // exemple simple
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des stats" });
  }
};