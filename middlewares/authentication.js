const {sendOtp,getOtpForm}= require("./otp")

module.exports={

    checkAccountVerified: (req, res, next) => {
        if (req.user.isVerified) {
            next()
        }
        else {
            return getOtpForm(req, res)
        }
    },
    checkAccountVerifiedInIndex: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isVerified) {
                next()
            }
            else {
                return getOtpForm(req, res)
            }
        } else {
            next()
        }
    },
}



