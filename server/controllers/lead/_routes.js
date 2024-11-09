const express = require('express');
const lead = require('./lead');
const auth = require('../../middelwares/auth');

const router = express.Router();
const resetQueryMiddleware = (req, res, next) => {
    req.query = {}; // Reset query parameters
    next(); // Proceed to the next middleware or route handler
};
router.get('/', auth, resetQueryMiddleware, lead.leadIndex);
router.post('/add', auth, lead.add)
router.post('/addMany', auth, lead.addMany)
router.get('/view/:id', auth, lead.view)
router.put('/edit/:id', auth, lead.edit)
router.put('/changeStatus/:id', auth, lead.changeStatus)
router.delete('/delete/:id', auth, lead.deleteData)
router.post('/deleteMany', auth, lead.deleteMany)

module.exports = router