import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function DELETE(req: Request) {
  try {
    const { planId } = await req.json()

    if (!planId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Plan ID is required',
          code: 'MISSING_PLAN_ID'
        },
        { status: 400 }
      )
    }

    console.log("[v0] Deleting plan:", planId)

    // Delete will cascade to all related tables due to ON DELETE CASCADE
    await sql`DELETE FROM training_plans WHERE id = ${planId}`

    console.log("[v0] Plan deleted successfully")

    return NextResponse.json({
      success: true,
      message: 'Plan deleted successfully'
    })
  } catch (error) {
    console.error('[v0] Error deleting plan:', error)

    let errorMessage = 'Failed to delete plan'
    let errorCode = 'UNKNOWN_ERROR'

    if (error instanceof Error) {
      errorMessage = error.message
      if (error.message.includes('no rows were affected')) {
        errorCode = 'PLAN_NOT_FOUND'
        errorMessage = 'Plan not found'
      }
    }

    console.log("[v0] Returning error response:", { errorCode, errorMessage })

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        code: errorCode
      }, 
      { status: 500 }
    )
  }
}
