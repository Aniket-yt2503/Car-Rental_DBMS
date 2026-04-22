import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerId, requestedClassId, pickupLocationId, dropoffLocationId, 
      pickupDate, dropoffDate, startOdometer, totalPrice 
    } = body;

    // 1. Find an available car in exactly the requested class at pickup
    let assignedCar = await prisma.car.findFirst({
      where: {
        classId: requestedClassId,
        locationId: pickupLocationId,
        isAvailable: true
      }
    });

    // 2. Bonus Feature: Auto-Upgrade Logic
    if (!assignedCar) {
      // Find a higher class if available (For demo, just find ANY available car that is not the same)
      assignedCar = await prisma.car.findFirst({
        where: {
          locationId: pickupLocationId,
          isAvailable: true,
          classId: { not: requestedClassId } // Simplified logic: grab alternate tier
        }
      });

      if (!assignedCar) {
        return NextResponse.json({ error: "No cars available at this location for any class." }, { status: 400 });
      }
    }

    // 3. Create the rental record
    const rental = await prisma.rental.create({
      data: {
        customerId,
        carId: assignedCar.id,
        pickupLocationId,
        dropoffLocationId,
        pickupDate: new Date(pickupDate),
        dropoffDate: new Date(dropoffDate),
        startOdometer,
        startFuel: 'FULL',
        totalPrice,
        status: 'ACTIVE'
      }
    });

    // 4. Mark car as unavailable
    await prisma.car.update({
      where: { id: assignedCar.id },
      data: { isAvailable: false }
    });

    return NextResponse.json({ success: true, rental, upgraded: assignedCar.classId !== requestedClassId });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create rental" }, { status: 500 });
  }
}
