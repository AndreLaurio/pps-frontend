<template>
    <div>
        <UserHome/>
            <v-content>
                <UserDashboard/>
            </v-content>
    </div>
</template>

<script>
import UserHome from '@/components/user/UserHome'
import UserDashboard from '@/components/user/UserDashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        UserHome, UserDashboard
    }
}
</script>