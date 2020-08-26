<template>
    <div>
        <h1>User Examination</h1>
            <v-main>
                <UserDashboard/>
            </v-main>
    </div>
</template>

<script>
import UserDashboard from '@/components/user/UserDashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        UserDashboard
    }
}
</script>