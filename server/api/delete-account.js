import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    const userId = body.userId

    if (!userId) {  // ✅ FIXED: Corrected user ID validation
        console.error('❌ Error: User ID is missing')
        return { status: 400, body: { error: "User ID is required" } }
    }

    try {
        // Delete the user from Supabase Auth
        const { error } = await supabase.auth.admin.deleteUser(userId)

        if (error) throw error

        return { status: 200, body: { success: true, message: "Account deleted successfully" } }
    } catch (error) {
        return { status: 500, body: { error: error.message } }
    }
})
