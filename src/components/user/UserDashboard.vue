<template>
    <nav class="pop">
        <v-navigation-drawer v-model="drawer" app color="grey lighten-5">
            <v-list dense>
                <v-list>
                    <v-list-item-content>
                        <v-avatar>
                            <img src="https://cdn.vuetifyjs.com/images/john.jpg" width="100px" height="100px">
                        </v-avatar>
                        <div>
                            <h4 class="text-center mt-3">{{userData.first_name}} {{userData.last_name}}</h4>
                        </div>
                    </v-list-item-content>
                </v-list> 
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Home
                    </v-list-item-content>
                </v-list-item>
                   <v-list-item link>
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-clipboard-text-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Examination
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link v-on:click="logout">
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-logout</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Logout
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="#760D11" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Philippine Pediatric Society</v-toolbar-title>
            <v-spacer></v-spacer>
            <img src="../../assets/pps-logo.png" class="mr-5" width="40px" height="40px">
        </v-app-bar>
    </nav>
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
                first_name:'',
                last_name:''
            },
            drawer: false,
        }
    },
    mounted(){
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('api/user').then(response =>{
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