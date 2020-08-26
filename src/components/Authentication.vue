<template>
    <v-container grid-list-md class="pop">
        <v-card color="#760D11" height="600">
        <v-layout row wrap class="mt-5">
            <v-flex xs12 md6 class="pt-12">
                    <v-img src="../assets/pps-logo.png" class="mx-auto mt-12" width="200"></v-img>
                    <a href="https://pps.org.ph/"><h1 class="text-center mt-3 below-img">pps.org.ph</h1></a>
            </v-flex>
            <v-flex xs12 md6>
                <v-card class="mx-auto rounded-xl mt-3 mb-3" max-width="500">
                    <v-card-title class="pt-12">
                        <v-btn text color="red accent-4" @click="registration = true" class="ml-6" :class="{'ifSelected' : registration == true}"> <h3>Register</h3> </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text color="red accent-4" @click="registration = false" class="mr-5" :class="{'ifSelected' : registration == false}"> <h3>Login</h3> </v-btn>
                    </v-card-title>
                    <v-card-text class="mt-8 pl-12 pr-12">
                        <div v-if="registration">
                            <v-text-field v-model="register_data.first_name" label="First Name" outlined :counter="15" :rules="fRules"></v-text-field>
                            <v-text-field v-model="register_data.surname" label="Surname" outlined :counter="15" :rules="sRules" required></v-text-field>
                            <div class="ml-12 pl-12 valerror hidden">{{registerValidation}}</div>
                            <v-text-field v-model="register_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-model="register_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                        </div>
                        <div v-else>
                            <v-text-field v-model="login_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-model="login_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                            <div class="ml-12 pl-12 valerror">{{loginValidation}}</div>
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
        </v-card>
    </v-container>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
.pop{
    font-family: 'Poppins', sans-serif;
}
.ifSelected{
    border-bottom: 1px solid #D50000;
}
.below-img{
    color:white;
}
a{
    text-decoration: none;
}
.valerror{
    color:red;
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
                password:'',
            },
            login_data:{
                email:'',
                password:''
            },
            emailRules:[
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            fRules:[
                v => !!v || 'First name is required',
            ],
            sRules:[
                v => !!v || 'Surname is required',
            ],
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            show_password: false,
            registration:true,
            registerValidation:'',
            loginValidation:''
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
                    //show pending for approval
                    console.log('success')
                    //auto login when registred successfully  this.$router.push({ name: 'User' })
                }).catch(err => {
                    // this.validationErrors = err.response.data.errors
                    //not fixed so alternative way
                    this.registerValidation = 'The Email is already taken.'
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
                    axios.get('/api/user').then(response =>{
                        let is_approved = response.data.is_approved
                        let user_type = response.data.user_type
                        if(is_approved == 1){
                            if(user_type == 1){
                                this.$router.push({ name: 'User' })
                            } else if(user_type == 2){
                                this.$router.push({ name: 'Admin' })
                            } else if(user_type == 3){
                                // Super Admin
                            }
                        }else{
                            console.log('waiting for approval')
                        }
                    })
                }).catch(err => {
                    this.loginValidation = 'The Email/Password is incorrect.'
                })
            }).catch(err => {console.log(err)})
        }
    }
}
</script>