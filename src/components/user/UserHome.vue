<template>
    <v-container class="pop">
        <v-layout row wrap justify-center>
            <v-flex xs12 md6 class="mt-12 pt-12">
                <div>
                    <h3>User Side</h3>
                </div>
                <v-card>
                    <v-card-title class="justify-center pt-6">
                        <h1>Welcome</h1> 
                    </v-card-title>
                    <v-card-subtitle class="text-center">
                         <h2> {{userData.first_name}} {{userData.last_name}} </h2> 
                    </v-card-subtitle>
                    <v-card-actions class="justify-center mt-3">
                         <v-btn v-on:click="logout" class="pl-12 pr-12 mb-5 primary red accent-4"> Logout </v-btn>
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
            axios.get('api/user').then(response =>{
                this.userData.user_id = response.data.id,
                this.userData.first_name = response.data.first_name,
                this.userData.last_name = response.data.last_name
            })
        },
        logout(){
            axios.post('/logout').then(response => {
                this.$router.push({ name: 'Home' })
            })
        }
    }
}
</script>