<template>
    <v-container class="pop">
        <v-layout justify-center>            
            <v-flex xs12 md6>
                 <v-card class="mx-auto rounded-xl mt-3 mb-3" color="#ffffff" max-width="500">
                     <v-card-title class="justify-center pt-6">
                            <h2 class="white--text">Welcome</h2> 
                        </v-card-title>
                        <v-card-text class="text-center">
                            <h1 class="white--text"> {{userData.first_name}} {{userData.last_name}} </h1> 
                        </v-card-text>
                        <v-card-actions class="justify-center mt-3">
                            <v-btn v-on:click="createUser" class="mb-5 primary red accent-4"> Create User </v-btn>
                            <v-btn v-on:click="accountApproval" class="mb-5 primary red accent-4"> Acct Approval </v-btn>
                            <v-btn v-on:click="createExam" class="mb-5 primary red accent-4"> Create Exam </v-btn>
                        </v-card-actions>
                 </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
</style>

<script>
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    data(){
        return{
            userData:{
                user_id:'',
                first_name:'',
                last_name:'',
            }
        }
    },

    mounted(){
        this.getUserData()
    },

    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.userData.user_id = response.data.user_id,
                this.userData.first_name = response.data.first_name,
                this.userData.last_name = response.data.last_name
            })
        },
        createUser(){
            this.$router.push({ name: 'AdminCreateUser' })
        },
        accountApproval(){
            this.$router.push({ name: 'AdminAccountApproval' })
        },
        createExam(){
            this.$router.push({ name: 'AdminExamination' })
        },
        logout(){
            axios.post('/logout').then(response => {
                this.$router.push({ name: 'Home' })
            })
        }
    }
}
</script>