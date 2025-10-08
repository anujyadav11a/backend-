import moongose, { Schema } from "moongose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,


    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true

    },
    avatar: {
        type: String,// cloudnary url
        required: true,
    },
    coverimage: {
        type: String,// cloudnary url

    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "vedio"
    }],

    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String
    },



}, {
    timestamps: true
}
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()

})


UserSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)

}

UserSchema.methods.generateAccessToken = function () {
   return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function () {
     return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
 }





export const User = moongose.model("User", UserSchema)