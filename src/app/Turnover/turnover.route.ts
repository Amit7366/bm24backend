import express from 'express';
import { TurnoverController } from './turnover.controller';


const router = express.Router();

router.post('/create', TurnoverController.create);
router.get('/:userId', TurnoverController.getUserTotal); // optional ?days=7
router.get('/turnover-chart/gameType/:userId', TurnoverController.getGroupedByGameTypePerDay);

router.get('/turnover-report/admin', TurnoverController.getAdminReport);

export const TurnoverRoutes = router;