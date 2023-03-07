const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ status: false, error: "Please aunthenticate using valid token" });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ status: false, error: "Please aunthenticate using valid token" });
    }
}

module.exports = authUser;