const jwt = require("jsonwebtoken");
const { Models } = require("../Classes/Models");
const { jwtSecret } = require("../config/secrets");

const users = new Models("users");

const verifyToken = () => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, jwtSecret);
            if (token && decoded) {
                req.decoded = decoded;
                next();
            } else {
                return res
                    .status(401)
                    .json({ message: "You are not authorized" });
            }
        } catch (err) {
            next(err);
        }
    };
};

const validateUserToken = () => {
    return async (req, res, next) => {
        const id = req.decoded.subject;
        if (id) {
            const user = await users.findBy({ id });
            if (user) {
                req.user = user;
                next();
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } else {
            return res.status(401).json({ message: "You are not authorized" });
        }
    };
};

function validateLoginReqBody() {
    return (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email or Password is undefined"
            });
        } else {
            next();
        }
    };
}
function validateRegisterReqBody() {
    return (req, res, next) => {
        const { email, password, first_name, last_name, phone_number, zip_code } = req.body;
        if (!email || !password || !first_name || !last_name || !phone_number || !zip_code ) {
            return res.status(400).json({
                message: "Fill in all required fields"
            });
        } else {
            next();
        }
    };
}

function userExist() {
    return async (req, res, next) => {
        const { email, password } = req.body;
        const user = await users.findBy({ email });

        if (user) {
            req.data = {
                exist: true,
                user
            };
            next();
        } else {
            req.data = {
                user: user
            }
           next();
        }
    };
}

module.exports = {
    verifyToken,
    validateUserToken,
    validateLoginReqBody,
    userExist,
    validateRegisterReqBody
};
