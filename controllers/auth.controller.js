const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "validation error", errors });
            }

            const { username, password } = req.body;
            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({ message: "user already exists" });
            }

            const hashPassword = bcrypt.hashSync(password, 5);

            const userRole = await Role.findOne({ value: "USER" });

            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });

            await user.save();

            return res.json({ message: "User created" });
        } catch (error) {
            res.status(400).json({ message: "register error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "user not found" });
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: "password is not correct" });
            }

            const token = generateAccessToken(user._id, user.roles);

            return res.json({ token });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "login error" });
        }
    }

    async getUser(req, res) {
        try {
            const users = await User.find();
            return res.json(users);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "getUser error" });
        }
    }
}

module.exports = new authController();
