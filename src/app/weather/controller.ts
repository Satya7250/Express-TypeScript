import type { Request, Response } from "express";
import {
  weatherUpdateSchema,
  weatherValidationSchema,
  type Weather,
} from "../../schema/weather.schema.js";
import { weatherTable } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";

//#region //*========== Storing Data In Memory ==========

// class weatherController {
//   private _db: Weather[];

//   constructor() {
//     this._db = [];
//   }

//   public handleGetAllWeather(req: Request, res: Response) {
//     const weather = this._db;
//     return res.status(200).json({ weather });
//   }

//   public handleGetWeatherByCityName(req: Request, res: Response) {
//     const cityName = req.params.city;
//     if (!cityName || typeof cityName !== "string" || Array.isArray(cityName)) {
//       return res.status(404).json({ message: "Invalid Input" });
//     }
//     const matches = this._db.filter(
//       (city) => city.city.toLowerCase() === cityName.toLowerCase(),
//     );
//     if (matches.length === 0) {
//       return res.status(404).json({ message: "No city found with this name" });
//     }
//     return res.status(200).json({ weather: matches });
//   }

//   public async handleInsertWeather(req: Request, res: Response) {
//     try {
//       const unvalidated = req.body;
//       const validationResult =
//         await weatherValidationSchema.parseAsync(unvalidated);
//       const exists = this._db.some((item) => item.id === validationResult.id);
//       if (exists) {
//         return res
//           .status(409)
//           .json({ message: "Weather with this ID already exists" });
//       }
//       this._db.push(validationResult);
//       return res.status(201).json({ weather: validationResult });
//     } catch (error) {
//       return res.status(400).json({ error });
//     }
//   }

//   public async handleUpdateWeatherById(req: Request, res: Response) {
//     const idParam = req.params.id;
//     if (!idParam || Array.isArray(idParam)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }
//     const index = this._db.findIndex((t) => t.id === idParam);
//     if (index === -1) {
//       return res
//         .status(404)
//         .json({ message: "Weather not found with this id" });
//     }

//     try {
//       const data = await weatherUpdateSchema.parseAsync(req.body);

//       const updatedWeather = {
//         ...this._db[index],
//         ...data,
//         id: idParam,
//       } as Weather;
//       this._db[index] = updatedWeather;
//       return res.status(200).json({ weather: updatedWeather });
//     } catch (error) {
//       return res.status(400).json({
//         message: "Validation failed",
//         error: error instanceof Error ? error.message : error,
//       });
//     }
//   }

//   public async handleDeleteWeatherById(req: Request, res: Response) {
//     const idParam = req.params.id;
//     if (!idParam || Array.isArray(idParam)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }
//     const index = this._db.findIndex((t) => t.id === idParam)
//     if(index === -1){
//       return res.status(404).json({message: "NoDataFound"});
//     }
//     try {
//       const [deletedWeather] = this._db.splice(index, 1);
//       res.status(200).json({message: "User Deleted", deletedWeather});
//     } catch (error) {
//       return res.status(500).json({ error });
//     }
//   }
// }

//#endregion //*========== Storing Data In Memory ==========

class weatherController {
  public async handleGetAllWeather(req: Request, res: Response) {
    try {
      //@ts-ignore
      const userId = req.user?.id;

      const weather = await db
        .select()
        .from(weatherTable)
        .where(eq(weatherTable.userId, userId));
      return res.status(200).json({ weather });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async handleInsertWeather(req: Request, res: Response) {
    try {
      const unvalidated = req.body;
      //@ts-ignore
      unvalidated.userId = req.user?.id;

      const validationResult =
        await weatherValidationSchema.parseAsync(unvalidated);

      const [weather] = await db
        .insert(weatherTable)
        .values({
          city: validationResult.city,
          temperature: validationResult.temperature,
          humidity: validationResult.humidity,
          windSpeed: validationResult.windSpeed,
          userId: validationResult.userId,
        })
        .returning();

      return res.status(201).json({ weather });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async handleGetWeatherByCityName(req: Request, res: Response) {
    const cityParam = req.params.city;

    //@ts-ignore
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cityParam || typeof cityParam !== "string") {
      return res.status(400).json({ message: "Invalid city" });
    }

    try {
      const weather = await db
        .select()
        .from(weatherTable)
        .where(
          and(
            eq(weatherTable.city, cityParam),
            eq(weatherTable.userId, userId),
          ),
        );
      return res.status(200).json({ weather });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async handleUpdateWeatherById(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    //@ts-ignore
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = await weatherUpdateSchema.parseAsync(req.body);
      const [updatedWeather] = await db
        .update(weatherTable)
        .set(data)
        .where(
          and(eq(weatherTable.id, idParam), eq(weatherTable.userId, userId)),
        )
        .returning();

      if (!updatedWeather) {
        return res.status(404).json({ message: "Weather not found" });
      }
      return res.status(200).json({ weather: updatedWeather });
    } catch (error) {
      return res.status(500).json({ error: "update failed" });
    }
  }

  public async handleDeleteWeatherById(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    //@ts-ignore
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [deletedWeather] = await db
        .delete(weatherTable)
        .where(
          and(eq(weatherTable.id, idParam), eq(weatherTable.userId, userId)),
        )
        .returning();
      if (!deletedWeather) {
        return res.status(404).json({ message: "Weather not found" });
      }
      return res.status(200).json({ message: "Weather deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default weatherController;
