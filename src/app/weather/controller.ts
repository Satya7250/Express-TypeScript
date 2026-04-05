import type { Request, Response } from "express";
import {
  weatherUpdateSchema,
  weatherValidationSchema,
} from "../../schema/weather.schema.js";

import {
  getAllWeatherQuery,
  insertWeatherQuery,
  getWeatherByCityQuery,
  updateWeatherQuery,
  deleteWeatherQuery,
} from "./service.js";

class weatherController {
  public async handleGetAllWeather(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const weather = await getAllWeatherQuery(userId);

      return res.status(200).json({ weather });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch weather data",
      });
    }
  }

  public async handleInsertWeather(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const unvalidated = req.body;
      unvalidated.userId = userId;

      const validationResult =
        await weatherValidationSchema.parseAsync(unvalidated);

      const [weather] = await insertWeatherQuery({
        city: validationResult.city,
        temperature: validationResult.temperature,
        humidity: validationResult.humidity,
        windSpeed: validationResult.windSpeed,
        userId: validationResult.userId,
      });

      return res.status(201).json({ weather });
    } catch (error) {
      return res.status(400).json({
        message: "Invalid weather data",
      });
    }
  }

  public async handleGetWeatherByCityName(req: Request, res: Response) {
    const cityParam = req.params.city;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!cityParam || typeof cityParam !== "string") {
      return res.status(400).json({ message: "City parameter is invalid" });
    }

    try {
      const weather = await getWeatherByCityQuery(cityParam, userId);

      return res.status(200).json({ weather });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch weather by city",
      });
    }
  }

  public async handleUpdateWeatherById(req: Request, res: Response) {
    const idParam = req.params.id;
    const userId = req.user?.id;

    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid weather ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const data = await weatherUpdateSchema.parseAsync(req.body);

      const [updatedWeather] = await updateWeatherQuery(
        idParam,
        userId,
        data
      );

      if (!updatedWeather) {
        return res.status(404).json({ message: "Weather record not found" });
      }

      return res.status(200).json({ weather: updatedWeather });
    } catch (error) {
      return res.status(400).json({
        message: "Invalid update data",
      });
    }
  }

  public async handleDeleteWeatherById(req: Request, res: Response) {
    const idParam = req.params.id;
    const userId = req.user?.id;

    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid weather ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const [deletedWeather] = await deleteWeatherQuery(
        idParam,
        userId
      );

      if (!deletedWeather) {
        return res.status(404).json({ message: "Weather record not found" });
      }

      return res.status(200).json({
        message: "Weather deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete weather",
      });
    }
  }
}

export default weatherController;