import { Router } from 'express';
import { QueryController } from '../../controllers/QueryController';
import {getGMapsInfoFromLocation} from "../../helpers";

const router = Router();
const queryController = QueryController.getInstance();

router.post('/by-age-sex', async (req, res, next) => {
    const result = await queryController.queryByAgeAndSex(req, res, next);
    if (result) {
        return res.send(result);
    }
});

router.post('/by-names-date', async (req, res, next) => {
    const result = await queryController.queryByNamesAndDate(req, res, next);
    if (result) {
        return res.send(result);
    }
});

router.post('/by-proximity-daterange', async (req, res, next) => {
    const result = await queryController.queryByProximityAndDateRange(req, res, next);
    if (result) {
        return res.send(result);
    }
});


export default router;
