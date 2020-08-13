<template>
    <v-container>
        <h1>Hello {{userData.first_name}} {{userData.last_name}}</h1>
    </v-container>
</template>

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
        }
    }
}
</script>