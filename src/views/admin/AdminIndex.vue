<template>
    <div>
        <AdminHome/>
            <v-main>
                <AdminDashboard/>
            </v-main>
    </div>
</template>

<script>
import AdminHome from '@/components/admin/AdminHome'
import AdminDashboard from '@/components/admin/AdminDashboard'

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