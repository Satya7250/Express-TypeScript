import type { Request, Response } from "express";
import {weatherValidationSchema, type Weather} from "../../schema/weather.schema.js"

class weatherController{
    private _db: Weather[];

    constructor() {
        this._db = [];
    }

    public handleGetAllWeather(req: Request, res: Response) {
        const weather = this._db;
        return res.status(200).json({ weather });
    }

    public async handleInsertWeather(req: Request, res: Response) {
        try {
            const unvalidated = req.body;
            const validationResult = await weatherValidationSchema.parseAsync(unvalidated);
            this._db.push(validationResult);
            return res.status(201).json({weather: validationResult});
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}

export default weatherController;