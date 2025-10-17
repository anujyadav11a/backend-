import { Router } from "express";
import { registerUser,userLogin, userLogout,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()

router.route("/register").post(
    upload.fields([

        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),  registerUser)
router.route("/Login").post( userLogin)



router.route("/Logout").post( verifyJWT ,userLogout)
router.route("/refresh-Accesstoken").post(refreshAccessToken)
export default router