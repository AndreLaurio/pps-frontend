<template>
    <div>
        <v-layout justify-center>
            <v-flex xs12 md6>
                <v-card class="mx-auto rounded-xl mb-3 mt-5" max-width="500">
                    <v-card-title>
                        <h3 class="fcolor">Create Users</h3>
                    </v-card-title>
                    <v-card-text class="pl-12 pr-12">
                        <div class="valsuccess">{{register_validation_success}}</div>
                        <v-radio-group v-model="register_data.user_type" row>
                            <v-radio color="#760D11" label="Admin" value="2"></v-radio>
                            <v-spacer></v-spacer>
                            <v-radio color="#760D11" label="User" value="1"></v-radio>
                        </v-radio-group>
                        <v-text-field v-model="register_data.first_name" :counter="15" outlined label="First Name"></v-text-field>
                        <v-text-field v-model="register_data.surname" :counter="15" outlined label="Surname"></v-text-field>
                        <div class="ml-12 pl-12 valerror">{{register_validation_failed}}</div>
                        <v-text-field v-model="register_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                        <v-text-field v-model="register_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn v-on:click="register" class="pl-12 pr-12 mb-5 primary red accent-4"> Register</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-content>
            <AdminDashboard/>
        </v-content>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
.fcolor{
    color: #760D11;
}
.valerror{
    color:red;
}
.valsuccess{
    color: green;
}
</style>

<script>
import AdminDashboard from '@/components/admin/AdminDashboard'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    data(){
        return{
            register_data:{
                first_name:'',
                surname:'',
                email:'',
                password:'',
                user_type:''
            },
            emailRules:[
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            show_password: false,
            register_validation_success:'',
            register_validation_failed:''
        }
    },
    components:{
        AdminDashboard
    },
    methods:{
        register(){
            axios.post('/register',{
                first_name: this.register_data.first_name,
                last_name: this.register_data.surname,
                email: this.register_data.email,
                password: this.register_data.password,
                password_confirmation: this.register_data.password,
                user_type: this.register_data.user_type
            }).then(response => {
                this.register_data.first_name = '',
                this.register_data.last_name = '',
                this.register_data.email = '',
                this.register_data.password = '',
                this.register_data.password_confirmation = '',
                this.register_data.password_confirmation = ''
                this.register_validation_success = 'The user is successfully added.'
            }).catch(err => {
                this.register_validation_failed = 'The Email is already taken.'
            })
        }
    }
}
</script>