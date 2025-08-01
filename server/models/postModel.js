const { Schema, model } = require('mongoose');

const postSchema = new Schema({
     creator: { type: Schema.Types.ObjectId, ref: "User" },          // Reference to the User model
     body: { type: String, required: true },                         // Required post content
     image: { type: String, required: true },                        // Required image URL or path
     likes: [{ type: Schema.Types.ObjectId, ref: "User" }],          // Array of users who liked the post
     comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]      // Array of comment references
});

module.exports = model('Post', postSchema);
