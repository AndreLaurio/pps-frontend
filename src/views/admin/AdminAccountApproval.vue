<template>
    <div class="pop">
        <h1 class="mt-12 ml-12">Account Approval</h1>
        <v-layout class="ml-12" justify-center>
            <v-flex xs12 sm12 xl10 md10>
                <div class="mt-12">
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-center">First Name</th>
                                    <th class="text-center">Last Name</th>
                                    <th class="text-center">Email</th>
                                    <th class="text-center">Registered Date</th>
                                    <th class="text-center">Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="pAccount in pendingAccount" :key="pAccount.id">
                                    <td class="text-center">{{ pAccount.first_name }}</td>
                                    <td class="text-center">{{ pAccount.last_name }}</td>
                                    <td class="text-center">{{ pAccount.email }}</td>
                                    <td class="text-center">{{ pAccount.created_at.slice(0,10)}}</td>
                                    <td class="text-center">
                                       <v-btn class="mx-2 success" small v-on:click="acceptAccount(pAccount.id)"><v-icon>mdi-check-bold</v-icon></v-btn>
                                       <v-btn class="mx-2 error" small v-on:click="rejectAccount(pAccount.id)"><v-icon>mdi-delete</v-icon></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
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

import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    components:{
        AdminDashboard
    },
    data(){
        return{
            pendingAccount:[],
            userId:''
        }
    },
    mounted(){
        this.getAccounts()
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.userId = response.data.id
            })
        },
        getAccounts(){
            axios.get('/api/accounts').then(response =>{
                this.pendingAccount = response.data
                // console.log(response.data)
            })
        },
        acceptAccount(id){
            axios.put(`/api/accounts/${id}`,{
                is_approved: 1,
                approved_by: this.userId
            }).then(response => {
                console.log('success')
            }).catch(error => { 
                
            })
        },
        rejectAccount(id){
            axios.put(`/api/accounts/${id}`,{
                is_approved: 3,
                approved_by: this.userId
            }).then(response => {

            }).catch(error =>{

            })
        }
    }
}
</script>