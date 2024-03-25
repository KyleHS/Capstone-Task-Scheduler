const Joi = require('joi');

module.exports.taskSchema = Joi.object({
    task: Joi.object({
        taskname: Joi.string().required(),
        taskdescription: Joi.string().required(),
        taskid: Joi.int().required(),
        time: Joi.date().required(),
    }).required()
});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(6)
            .max(12)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        email: Joi.string()
            .email({  minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        createdAt: Joi.date().required(),
    }).required()
})