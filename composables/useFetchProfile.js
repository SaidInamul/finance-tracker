export const useFetchProfile = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const getProfile = async () => {

        const { data, error } = await supabase
            .from('user_profiles')
            .select('name, avatar, time_period, unit_currency')
            .eq('user_id', user.value.id)
            .single()

        if (error) {
            console.log('Error fetching profile:', error)
            return null
        }

        return data 
    }

    return {
        getProfile
    }
}