<template>
    <nav class="pop">
        <v-navigation-drawer v-model="drawer" app color="grey lighten-5">
            <v-list dense>
                 <v-list>
                    <v-list-item-content color="#760D11">
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
                        Examinations
                    </v-list-item-content>
                </v-list-item>
                 <v-list-item link>
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-account-supervisor</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Examinees
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link v-on:click="accountApproval">
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-account-supervisor-circle-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Account Approval
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link v-on:click="createUser">
                    <v-list-item-action>
                        <v-icon color="#760D11">mdi-account-plus</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        Create User
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
            <v-app-bar-nav-icon class="mr-3" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <img src="../../assets/pps-logo.png" class="mr-3" width="40px" height="40px">
            <v-toolbar-title>Philippine Pediatric Society</v-toolbar-title>
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
            drawer: true,
        }
    },
    mounted(){
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.userData.first_name = response.data.first_name,
                this.userData.last_name = response.data.last_name
            })
        },
        createUser(){
            this.$router.push({ name: 'AdminCreateUser' })
        },
        createExam(){
            this.$router.push({ name: 'Admin' })
        },
        accountApproval(){
            this.$router.push({ name: 'AdminAccountApproval' })
        },
        logout(){
            axios.post('/logout').then(response => {
                this.$router.push({ name: 'Home' })
            })
        }
    }
}
</script>