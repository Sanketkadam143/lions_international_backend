// Router file
import express from 'express';
import { getMember } from '../../controllers/superadmin/members.js';

const router = express.Router();

router.get('/getMembers', getMember);
export default router;