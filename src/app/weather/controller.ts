import type { Request, Response } from "express";
import {
    weatherValidationSchema,
    type Weather,
} from "../../schema/weather.schema.js";

class weatherController {
    private _db: Weather[];

    constructor() {
        this._db = [];
    }

    public handleGetAllWeather(req: Request, res: Response) {
        const weather = this._db;
        return res.status(200).json({ weather });
    }

    public handleGetWeatherByCityName(req: Request, res: Response) {
        const cityName = req.params.city;
        if (!cityName || typeof cityName !== "string" || Array.isArray(cityName)) {
            return res.status(404).json({ message: "Invalid Input" });
        }
        const matches = this._db.filter(
            (city) => city.city.toLowerCase() === cityName.toLowerCase(),
        );
        if (matches.length === 0) {
            return res.status(404).json({ message: "No city found with this name" });
        }
        return res.status(200).json({ weather: matches });
    }

    public async handleInsertWeather(req: Request, res: Response) {
        try {
            const unvalidated = req.body;
            const validationResult =
                await weatherValidationSchema.parseAsync(unvalidated);
            const exists = this._db.some(item => item.id === validationResult.id);
            if(exists){
                return res.status(409).json({message: "Weather with this ID already exists"})
            }
            this._db.push(validationResult);
            return res.status(201).json({ weather: validationResult });
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}

export default weatherController;
