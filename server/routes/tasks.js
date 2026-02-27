const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  reorderTask,
  deleteTask,
  getSubtasks,
  createSubtask,
} = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/toggle', toggleTask);
router.patch('/:id/reorder', reorderTask);
router.delete('/:id', deleteTask);
router.get('/:id/subtasks', getSubtasks);
router.post('/:id/subtasks', createSubtask);

module.exports = router;
