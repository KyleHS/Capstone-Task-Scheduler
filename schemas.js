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
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required(),
        createdAt: Joi.date().required(),
    }).required()
})