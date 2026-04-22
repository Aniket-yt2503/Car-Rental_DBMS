import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");
  const classId = searchParams.get("classId");

  try {
    const filters: any = { isAvailable: true };
    if (locationId) filters.locationId = locationId;
    if (classId) filters.classId = classId;

    const cars = await prisma.car.findMany({
      where: filters,
      include: {
        carClass: true,
        location: true,
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}
