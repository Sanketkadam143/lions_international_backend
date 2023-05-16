import express from 'express';
import { addClub ,getClub,deleteClub} from '../../controllers/superadmin/clubs.js';

const router = express.Router();

router.post('/addClubs', addClub);
router.get('/getClubs',getClub);
router.delete("/deleteClub",deleteClub);
export default router;
