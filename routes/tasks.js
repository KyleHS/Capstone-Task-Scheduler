const express = require('express');
const router = express.Router();

const { taskSchema } = require('../schemas.js');
const Task = require('../models/task');

const ExpressError = require('../utils/ExpressError.js');
const catchAsync = require('../utils/catchAsync.js');

const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const tasks = await Task.find({});
    res.render('scheduler/overview', { tasks })
}));

router.get('/new', (req, res) => {
    res.render('scheduler/new');
})


router.post('/', validateTask, catchAsync(async (req, res, next) => {
    // if (!req.body.task) throw new ExpressError('Invalid Task Data', 400);
    const task = new Task(req.body.task);
    await task.save();
    req.flash('success', 'Successfully made a new task!');
    res.redirect(`/tasks/`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        req.flash('error', 'Cannot find that task!');
        return res.redirect('/tasks');
    }
    res.render('scheduler/overview', { task });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        req.flash('error', 'Cannot find that task!');
        return res.redirect('/tasks');
    }
    res.render('scheduler/edit', { task });
}))

router.put('/:id', validateTask, catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { ...req.body.task });
    req.flash('success', 'Successfully updated task!');
    res.redirect(`/tasks/`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted task!')
    res.redirect('/tasks');
}));

module.exports = router;