<template>
    <div>
        <h1>Profile</h1>
        <v-main>
            <UserDashboard/>
        </v-main>
    </div>
</template>

<script>
import UserDashboard from '@/components/user/UserDashboard'
export default {
    components:{
        UserDashboard
    }
}
</script>