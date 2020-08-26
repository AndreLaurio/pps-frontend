<template>
    <div class="pop">
        <v-layout>
            <v-flex xs12 md6>
                <h1>Account Approval</h1>
            </v-flex>
        </v-layout>
        <v-main>
            <AdminDashboard/>
        </v-main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
</style>

<script>
import AdminDashboard from '@/components/admin/AdminDashboard'

export default {
    components:{
        AdminDashboard
    }
}
</script>