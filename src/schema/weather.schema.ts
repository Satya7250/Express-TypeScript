import { z } from "zod";

export const weatherValidationSchema = z.object({
    city: z.string().describe('City for the weather'),
    temperature: z.number().describe('temeratur of the Area'),
    humidity: z.string().optional().describe('humidity of the Area'),
    windSpeed: z.number().optional().describe('wind speed of the Area'),
    userId: z.string().uuid().describe('ID of the user who recorded the weather'),
})

export const weatherUpdateSchema = z.object({
    city: z.string().optional().describe('City for the weather'),
    temperature: z.number().optional().describe('temeratur of the Area'),
    humidity: z.string().optional().describe('humidity of the Area'),
    windSpeed: z.number().optional().describe('wind speed of the Area'),
})
export type Weather = z.infer<typeof weatherValidationSchema>
