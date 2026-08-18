import mongoose from 'mongoose';
const BookingSchema=new mongoose.Schema({userId:{type:String,required:true},userName:String,show:{type:mongoose.Schema.Types.ObjectId,ref:'Show',required:true},amount:Number,bookedSeats:[String],isPaid:{type:Boolean,default:false}},{timestamps:true}); export default mongoose.model('Booking',BookingSchema);
