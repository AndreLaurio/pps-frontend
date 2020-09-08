<template>
    <div class="pop mt-12 ml-12">
        <h2 class="mb-12">Profile</h2>
        <v-layout justify-center>
            <v-flex xs12 sm12 md10 xl3>
                sample image
            </v-flex>
            <v-flex xs12 sm12 md10 xl6>
                <v-card class="rounded-xl" elevation="5">
                    <v-card-title>
                        Details
                    </v-card-title>
                    <v-card-text>
                        <label for="fname">First name:</label><br>
                          <v-text-field label="Another input"></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
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

        }
    },
    mounted(){
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.userId = response.data.user_id
            })
        },
    }
}
</script>