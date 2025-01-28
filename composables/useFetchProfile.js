export const useFetchProfile = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const getProfile = async () => {
        const { data } = await useAsyncData('userProfile', async () => {
            const { data, error } = await supabase.from('user_profiles').select()
            
            if (error) {
                console.log(error)
                return []
            }
            console.log(data)
            return data
        })
        return data.value
    }

    return {
        getProfile
    }
}