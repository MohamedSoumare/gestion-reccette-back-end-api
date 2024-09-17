const { check, param, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { Recipe } = require('../models/recipeModel');

// Validation pour l'ajout d'une recette
const addRequestValidator = [
  check('titre')
    .not()
    .isEmpty()
    .withMessage('Titre ne peut pas être vide!')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Minimum 6 caractères requis!')
    .bail()
    .custom(async (value, { req }) => {
      const result = await Recipe.checkRecipe(value);
      if (result !== 0) {
        throw new Error('Cette recette existe déjà!');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  },
];

// Validation pour la suppression d'une recette
const deleteRequestValidator = [
  param('id')
    .not()
    .isEmpty()
    .withMessage('Id est obligatoire!')
    .bail()
    .custom(async (value, { req }) => {
      const result = await Recipe.getRecipeById(value);
      if (result.length === 0) {
        throw new Error("Cette recette n'existe pas!");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    next();
  },
];

module.exports = { addRequestValidator, deleteRequestValidator };
