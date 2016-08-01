var router = express.Router();
var apiCtrl = require('../controllers/foo');

router.get('/foo', apiCtrl.retrieve);
router.post('/foo', apiCtrl.post);

module.exports = router;