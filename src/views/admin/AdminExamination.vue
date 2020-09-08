<template>
    <div class="pop ml-12 mt-12">
        <v-layout row wrap>
            <v-flex>
                <h2>Examinations</h2>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="ml-12 mt-5">
            <v-flex>
                <v-text-field prepend-inner-icon="mdi-magnify" rounded solo label="Search Exam"></v-text-field>
            </v-flex>
            <v-flex class="ml-12">
                <v-btn color="#760D11" dark rounded v-on:click="createExamination"> <v-icon size="17" class="pr-1">mdi-plus-thick</v-icon> Create Exam </v-btn>    
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-5">
            <v-flex xs12 sm12 md10 xl7>
                <v-expansion-panels accordion>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3>Sample Title</h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <h3>Sample content</h3>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
    },
    methods:{
        createExamination(){
            this.$router.push({ name: 'AdminCreateExamination' })
        }
    }
}
</script>