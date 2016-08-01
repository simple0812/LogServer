var router = express.Router();
var apiCtrl = require('../controllers/file');


router.get('/', apiCtrl.render);
router.get('/file/v', apiCtrl.render);
router.get('/file/log/v', apiCtrl.renderLog);

router.get('/writeLog', apiCtrl.writeLog);
router.get('/readLog', apiCtrl.readLog);

router.post('/file/upload', apiCtrl.upload);
router.get('/file/download', apiCtrl.download);

router.get('/files', apiCtrl.retrieve);
router.get('/files/page', apiCtrl.page);

router.delete('/file', apiCtrl.delete);


module.exports = router;