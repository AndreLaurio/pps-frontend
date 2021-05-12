<template>
    <div>
        <AdminHome/>
            <v-main>
                <AdminDashboard/>
            </v-main>
    </div>
</template>

<script>
import AdminHome from '@/components/admin/Home'
import AdminDashboard from '@/components/admin/Dashboard'

export default {
    data(){
        return{

        }
    },
    components:{
        AdminHome, AdminDashboard
    }
}
</script>