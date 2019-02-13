const path = require('path');
const express = require('express');

const router = express.Router();

const root = path.dirname(require.main.filename);
const index_path = path.join(root, 'view', 'index.pug');

router.get('/', (req,res,next) => {
    res.render(index_path);
});

module.exports = router;