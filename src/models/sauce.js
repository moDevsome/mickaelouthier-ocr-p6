/**
 * ----------------------------------------------
 * Model "sauce"
 * Représente l'entité "sauce" en base de données
 * ----------------------------------------------
 */

 const mongoose = require('mongoose');
 const mongooseUniqueValidator = require('mongoose-unique-validator');

 const sauceSchema = mongoose.Schema({
      userId: { type: String, required: true },
      name: { type: String, required: true },
      manufacturer: { type: String, required: true },
      description: { type: String, required: true },
      mainPepper: { type: String, required: true },
      imageUrl: { type: String, required: true },
      heat: {
         type: Number,
         required: true,
         min: [1, 'La valeur "heat" doit être comprise entre 1 et 10'],
         max: [10, 'La valeur "heat" doit être comprise entre 1 et 10']
      },
      likes: { type: Number, required: true },
      dislikes: { type: Number, required: true },
      usersLiked: { type: [String], required: true },
      usersDislike: { type: [String], required: true }
 });
 sauceSchema.plugin(mongooseUniqueValidator); // On associe le plugin "mongoose-unique-validator" pour qu'une vérification automatique de l'unicité du userId soit effectuée

 module.exports = mongoose.model('sauce', sauceSchema);