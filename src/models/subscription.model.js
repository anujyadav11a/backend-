import mongoose,{Schema} from "mongoose";   
import { type } from "os";

const subscriptionSchema=new Schema({

    subscriber:{
        type:Schema.Types.ObjectId,
        ref: User
    },

    channel:{
        type:Schema.Types.ObjectId,
        ref:User
    }

},{timestamps:true})

export const subscription= mongoose.Model("subscription",subscriptionSchema)