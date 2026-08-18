import mongoose from 'mongoose';
const ShowSchema=new mongoose.Schema({movie:{type:mongoose.Schema.Types.ObjectId,ref:'Movie',required:true},showDateTime:{type:Date,required:true},showPrice:{type:Number,required:true},occupiedSeats:{type:Map,of:String,default:{}}},{timestamps:true}); export default mongoose.model('Show',ShowSchema);
