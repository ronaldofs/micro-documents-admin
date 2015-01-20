var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocumentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date
  }
});

DocumentSchema.pre('save', onPreSave);

module.exports = mongoose.model('Document', DocumentSchema, 'documents');

function onPreSave(next) {
  this.updatedAt = new Date();
  next();
}
