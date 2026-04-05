import { db } from "../../db/index.js";
import { weatherTable } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export const getAllWeatherQuery = (userId: any) => {
  return db
    .select()
    .from(weatherTable)
    .where(eq(weatherTable.userId, userId));
};

export const insertWeatherQuery = (data: any) => {
  return db
    .insert(weatherTable)
    .values(data)
    .returning();
};

export const getWeatherByCityQuery = (city: string, userId: any) => {
  return db
    .select()
    .from(weatherTable)
    .where(
      and(
        eq(weatherTable.city, city),
        eq(weatherTable.userId, userId)
      )
    );
};

export const updateWeatherQuery = (id: string, userId: any, data: any) => {
  return db
    .update(weatherTable)
    .set(data)
    .where(
      and(
        eq(weatherTable.id, id),
        eq(weatherTable.userId, userId)
      )
    )
    .returning();
};

export const deleteWeatherQuery = (id: string, userId: any) => {
  return db
    .delete(weatherTable)
    .where(
      and(
        eq(weatherTable.id, id),
        eq(weatherTable.userId, userId)
      )
    )
    .returning();
};