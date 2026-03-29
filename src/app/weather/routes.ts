import {Router} from "express"
import weatherController from './controller.js'

const router = Router()
const controller = new weatherController()

router.get('/', controller.handleGetAllWeather.bind(controller));
router.get('/:city', controller.handleGetWeatherByCityName.bind(controller));
router.post('/', controller.handleInsertWeather.bind(controller));
// router.put('/:id');
// router.delete('/:id');

export default router