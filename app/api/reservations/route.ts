import { prisma } from '@/lib/prisma'
import { reservationSchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = reservationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), {
        status: 400,
      })
    }

    const { productId, warehouseId, quantity } = parsed.data

    const result = await prisma.$transaction(
      async (tx) => {
        const inventoryRows = await tx.$queryRaw<
          {
            id: string
            totalStock: number
            reservedStock: number
          }[]
        >(Prisma.sql`
          SELECT *
          FROM "Inventory"
          WHERE "productId" = ${productId}
          AND "warehouseId" = ${warehouseId}
          FOR UPDATE
        `)

        const inventory = inventoryRows[0]

        if (!inventory) {
          throw new Error('INVENTORY_NOT_FOUND')
        }

        const availableStock =
          inventory.totalStock - inventory.reservedStock

        if (availableStock < quantity) {
          throw new Error('INSUFFICIENT_STOCK')
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedStock: {
              increment: quantity,
            },
          },
        })
 const reservation = await tx.reservation.create({
          data: {
            inventoryId: inventory.id,
            quantity,
            status: 'PENDING',
            expiresAt: new Date(
              Date.now() + 10 * 60 * 1000
            ),
          },
        })

        return reservation
      },
      {
        isolationLevel: 'Serializable',
      }
    )

    return NextResponse.json(result)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'INSUFFICIENT_STOCK'
    ) {
      return NextResponse.json(
        {
          message: 'Not enough stock available',
        },
        {
          status: 409,
        }
      )
    }

    if (
      error instanceof Error &&
      error.message === 'INVENTORY_NOT_FOUND'
    ) {
      return NextResponse.json(
        {
          message: 'Inventory not found',
        },
        {
          status: 404,
        }
      )
    }

    console.error(error)

    return NextResponse.json(
      {
        message: 'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}