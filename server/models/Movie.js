import mongoose from 'mongoose';
const MovieSchema=new mongoose.Schema({tmdbId:Number,title:{type:String,required:true},overview:String,poster_path:String,backdrop_path:String,genres:[{id:Number,name:String}],release_date:String,original_language:String,tagline:String,vote_average:Number,runtime:Number,casts:[{name:String,profile_path:String}]},{timestamps:true});
export default mongoose.model('Movie',MovieSchema);
