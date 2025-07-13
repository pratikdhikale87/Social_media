const {Schema, model} = require('mongoose');

// defining  userSchema for user Details 

const userSchema = new Schema({
     fullName:{type : String, required : true},
     email : {type: String, required: true},
     password: {type: String, required: true},
     profilePhoto: { type: String, default:'https://res.cloudinary.com/dgnuh0uyl/image/upload/v1749972285/profile_icon.jpg'},
     bio:{type: String, default: 'not boi yet'},
     follower: [{type : Schema.Types.ObjectId, ref:'User'}],
     following:[ {type: Schema.Types.ObjectId, ref:'User'}],
     bookmarks : [{type: Schema.Types.ObjectId, ref:'Post'}],
     posts : [{type: Schema.Types.ObjectId, ref:'Post'}]

},{timestamps: true});


module.exports = model('User', userSchema);