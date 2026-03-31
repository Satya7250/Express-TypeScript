import { z } from 'zod'

export const todoValidationSchema = z.object({
    id: z.string().optional().describe('ID of the todo'),
    title: z.string().describe('title of the todo'),
    description: z.string().optional().describe('description for the todo'),
    isCompleted: z.boolean().default(false).describe('if the todo item is completed or not')
})

export const todoUpdateSchema = z.object({
    id: z.string().optional().describe('ID of the todo'),
    title: z.string().optional().describe('title of the todo'),
    description: z.string().optional().describe('description for the todo'),
    isCompleted: z.boolean().optional().describe('if the todo item is completed or not')
}) 
