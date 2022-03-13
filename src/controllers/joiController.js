const Joi = require("joi");


exports.validLogIn = {
    body: Joi.object().keys(
        {email: Joi.string().email().required(), password: Joi.string().required()}
    )
}

exports.validRegister = {
    body: Joi.object().keys(
        {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.ref("password"),
            name: Joi.string().required(),
            phone: Joi.string().required(),
            location: Joi.string().required(),
            age: Joi.number().required(),
            photo: Joi.string()
        }
    )
}
