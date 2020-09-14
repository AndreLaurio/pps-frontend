<template>
    <div>
        <Profile/>
        <v-main>
            <UserDashboard/>
        </v-main>
    </div>
</template>

<script>
import UserDashboard from '@/components/user/UserDashboard'
import Profile from '@/components/Profile'

export default {
    components:{
        UserDashboard, Profile
    }
}
</script>