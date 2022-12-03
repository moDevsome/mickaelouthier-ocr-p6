/**
 * ---------------------------------------------
 * Model "user"
 * Représente l'entité "user" en base de données
 * ---------------------------------------------
 */

 const mongoose = require('mongoose');
 const mongooseUniqueValidator = require('mongoose-unique-validator');

 const userSchema = mongoose.Schema({
     email: { type: String, index: true, unique: true, required: true },
     password: { type: String, required: true }
 });
 userSchema.plugin(mongooseUniqueValidator); // On associe le plugin "mongoose-unique-validator" pour qu'une vérification automatique de l'unicité de l'email soit effectuée

 module.exports = mongoose.model('user', userSchema);