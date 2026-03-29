import { z } from "zod";

export const weatherValidationSchema = z.object({
    id: z.string().describe('ID of the weather'),
    city: z.string().describe('City for the weather'),
    temperature: z.number().describe('temeratur of the Area'),
    humidity: z.string().optional().describe('humidity of the Area'),
    windSpeed: z.number().optional().describe('wind speed of the Area'),
    recordedAt: z.date().default(() => new Date()).describe('recorded data time')
})

export type Weather = z.infer<typeof weatherValidationSchema>