<template>
    <v-container grid-list-md>
        <v-layout row wrap class="mt-12">
            <v-flex xs12 md6>
                <v-btn outlined block class="primary">For Image</v-btn>
            </v-flex>
            <v-flex xs12 md6>
                <v-card class="mx-auto" max-width="500">
                    <v-card-title class="pt-12">
                        <v-btn text color="red accent-4" @click="registration = true" :class="{'ifSelected' : registration == true}"> <h3>Register</h3>  </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text color="red accent-4" @click="registration = false" :class="{'ifSelected' : registration == false}"> <h3>Login</h3> </v-btn>
                    </v-card-title>
                    <v-card-text class="mt-8 pl-12 pr-12">
                        <div v-if="registration">
                            <v-text-field v-model="register_data.first_name" label="First Name" outlined :counter="15"></v-text-field>
                            <v-text-field v-model="register_data.surname" label="Surname" outlined :counter="15"></v-text-field>
                            <v-text-field v-model="register_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-model="register_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                        </div>
                        <div v-else>
                            <v-text-field v-model="login_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-model="login_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <div v-if="registration">
                            <v-btn v-on:click="register" class="pl-12 pr-12 mb-5 primary red accent-4"> Register</v-btn>
                        </div>
                        <div v-else>
                            <v-btn v-on:click="login" class="pl-12 pr-12 mb-5 primary red accent-4"> Login </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped>
.ifSelected{
    border-bottom: 1px solid #D50000;
}
</style>

<script>
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
                password:''
            },
            login_data:{
                email:'',
                password:''
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
            registration:true
        }
    },
    methods:{
        register(){
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/register',{
                    first_name: this.register_data.first_name,
                    last_name: this.register_data.surname,
                    email: this.register_data.email,
                    password: this.register_data.password,
                    password_confirmation:this.register_data.password,
                    user_type: 1
                }).then(response => {
                    this.$router.push({ name: 'User' })
                }).catch(err => {
                    console.log('database error')
                })
            }).catch(err => {
                console.log('sanctum error')
            })
        },
        login(){
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/login',{
                    email: this.login_data.email,
                    password: this.login_data.password
                }).then(response => {
                    console.log('login success')
                })
            });
        }
    }
}
</script>