<template>
    <div class="pop">
        <h2 class="mt-12 ml-12">Account Approval</h2>
        <v-layout justify-center>
            <v-flex xs12 sm12 xl10 md10>
                <div class="mt-6">
                    <v-alert v-model="approvedSuccess" transition="fade-transition" type="success">
                        Approved Successfully!
                    </v-alert>
                    <v-alert v-model="rejectedSuccess" transition="fade-transition"  type="error">
                        Rejected Successfully!
                    </v-alert>
                    <v-data-table
                        :headers="pendingAccountHeaders"
                        :items="pendingAccount"
                        class="elevation-1"
                    >
                        <template v-slot:item="row">
                            <tr>
                                <td>
                                    {{row.item.first_name}}
                                </td>
                                 <td>
                                    {{row.item.last_name}}
                                </td>
                                <td class="text-center">
                                    {{row.item.email}}
                                </td>
                                <td class="text-center">
                                    {{row.item.created_at}}
                                </td>
                                <td class="text-center">
                                    <v-btn class="mx-2 success" small v-on:click="acceptAccount(row.item, row.item.user_id)"><v-icon>mdi-check-bold</v-icon></v-btn>
                                    <v-btn class="mx-2 error" small v-on:click="rejectAccount(row.item,row.item.user_id)"><v-icon>mdi-delete</v-icon></v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
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
            pendingAccountHeaders:[
                {text: 'First Name'},
                {text: 'Surname'},
                {text: 'Email', align:'center'},
                {text: 'Registered Date', align: 'center'},
                {text: 'Actions', align: 'center'}
            ],
            userId:'',
            approvedSuccess: false,
            rejectedSuccess: false
        }
    },
    mounted(){
        this.getAccounts()
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.userId = response.data.user_id
            })
        },
        getAccounts(){
            axios.get('/api/accounts').then(response =>{
                this.pendingAccount = response.data
                // console.log(response.data)
            })
        },
        acceptAccount(account, user_id){
            axios.put(`/api/accounts/${user_id}`,{
                is_approved: 1,
                approved_by: this.userId
            }).then(response => {
                //removing the account in the list when clicked
                var index = this.pendingAccount.indexOf(account)
                this.pendingAccount.splice(index, 1)
                //showing alerts
                this.approvedSuccess = true
                this.rejectedSuccess = false
            }).catch(error => { 
                console.log('ERROR please call the administrator')
            })
        },
        rejectAccount(account, user_id){
            axios.put(`/api/accounts/${user_id}`,{
                is_approved: 3,
                approved_by: this.userId
            }).then(response => {
                var index = this.pendingAccount.indexOf(account)
                this.pendingAccount.splice(index, 1)
                this.rejectedSuccess = true
                this.approvedSuccess = false
            }).catch(error =>{
                console.log('ERROR please call the administrator')
            })
        },
    }
}
</script>