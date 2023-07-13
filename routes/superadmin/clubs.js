import express from 'express';
import auth from '../../middleware/auth.js';
import { addClub ,getClub,deleteClub} from '../../controllers/superadmin/clubs.js';

const router = express.Router();

router.post('/addClubs', addClub);
router.get('/getClubs',auth,getClub);
router.delete("/deleteClub",deleteClub);
export default router;
