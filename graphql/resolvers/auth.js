const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existinguser = await User.findOne({ email: args.userInput.email })

            if (existinguser) {
                throw new Error('User exists already.')
            }
            const hashPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        }
        catch (err) {
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("User does not exist!");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SEC,
            { expiresIn: '1h' }
        );

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
};