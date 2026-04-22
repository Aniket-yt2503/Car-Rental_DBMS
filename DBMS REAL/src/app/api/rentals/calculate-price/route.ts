import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { carClassId, pickupLocationId, dropoffLocationId, durationDays, userId } = data;

    if (!carClassId || !pickupLocationId || !dropoffLocationId || durationDays == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Car Class Pricing Tier
    const carClass = await prisma.carClass.findUnique({ where: { id: carClassId } });
    if (!carClass) return NextResponse.json({ error: "Car class not found" }, { status: 404 });

    // Base price logic conceptually representing: 1 day, 1 week, 2 weeks, 1 month
    let basePrice = 0;
    let remainingDays = durationDays;

    const months = Math.floor(remainingDays / 30);
    remainingDays -= months * 30;
    const twoWeeks = Math.floor(remainingDays / 14);
    remainingDays -= twoWeeks * 14;
    const weeks = Math.floor(remainingDays / 7);
    remainingDays -= weeks * 7;
    
    basePrice += months * carClass.monthlyRate;
    basePrice += twoWeeks * carClass.twoWeekRate;
    basePrice += weeks * carClass.weeklyRate;
    basePrice += remainingDays * carClass.dailyRate;

    let discountPercentage = 0;

    // 2. Determine Employee Discount Rule OR Promotion Rule
    let isEmployee = false;
    if (userId) {
      const employee = await prisma.employeeProfile.findUnique({ where: { userId } });
      if (employee) {
        isEmployee = true;
        discountPercentage = durationDays < 14 ? 50 : 10;
      }
    }

    // Weekly promotions apply if it's NOT an employee
    if (!isEmployee) {
      const activePromotion = await prisma.promotion.findFirst({
        where: {
          carClassId: carClassId,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        }
      });
      if (activePromotion) {
        discountPercentage = activePromotion.discountPercentage;
      }
    }

    const discountAmount = basePrice * (discountPercentage / 100);

    // 3. Dropoff Charge Rule
    let dropoffChargeAmount = 0;
    if (pickupLocationId !== dropoffLocationId) {
      const dropOffCharge = await prisma.dropOffCharge.findUnique({
        where: {
          pickupLocationId_dropoffLocationId_carClassId: {
            pickupLocationId,
            dropoffLocationId,
            carClassId,
          }
        }
      });
      if (dropOffCharge) {
        dropoffChargeAmount = dropOffCharge.charge;
      }
    }

    const totalPrice = basePrice - discountAmount + dropoffChargeAmount;

    return NextResponse.json({
      basePrice,
      discountAmount,
      dropoffChargeAmount,
      totalPrice,
      durationDays
    });

  } catch (error) {
    return NextResponse.json({ error: "Pricing error" }, { status: 500 });
  }
}
