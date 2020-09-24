<template>
    <v-container class="pop">
        <v-card color="#760D11" height="600" width="1200" class="rounded-xl mx-auto">
        <v-layout row wrap class="mt-5">
            <v-flex xs12 sm12 md6 xl6 class="pt-12">
                    <v-img src="../assets/pps-logo.png" class="mx-auto mt-12" width="200"></v-img>
                    <a href="https://pps.org.ph/"><h1 class="text-center mt-3 below-img">pps.org.ph</h1></a>
            </v-flex>
            <v-flex xs12 sm12 md6 xl6>
                <v-card class="mx-auto rounded-xl mt-6 mb-3" v-if="registrationSuccess == false" max-width="500">
                    <v-card-title class="pt-12">
                        <v-btn text color="red accent-4" @click="registration = true" class="ml-6" :class="{'ifSelected' : registration == true}"> <h3>Register</h3> </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text color="red accent-4" @click="registration = false" class="mr-5" :class="{'ifSelected' : registration == false}"> <h3>Login</h3> </v-btn>
                    </v-card-title>
                    <v-card-text class="mt-3 pl-12 pr-12">
                        <div v-if="registration">
                            <!-- first Error val option -->
                            <!-- <div v-if="registerValidation">
                                <v-alert type="error" dense v-for="err in registerValidationContent" :key="err.id">
                                    {{err}}
                                </v-alert>
                            </div> -->
                            <!-- Second Option -->
                            <!-- <ul>
                                <li v-for="err in registerValidationContent" :key="err.id">
                                   <span class="red--text">{{err}}</span> 
                                </li>
                            </ul> -->
                            <v-text-field v-model="register_data.first_name" label="First Name" outlined :counter="15" :rules="fRules"></v-text-field>
                            <v-text-field v-model="register_data.surname" label="Surname" outlined :counter="15" :rules="sRules" required></v-text-field>
                            <v-text-field v-model="register_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-on:keyup.enter="register" v-model="register_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                            <div class="text-center">
                                <ul>
                                    <li v-for="err in registerValidationContent" :key="err.id" class="valerror">
                                    {{err}} 
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-else>
                            <v-text-field v-model="login_data.email" label="Email" outlined :rules="emailRules" :counter="30" required></v-text-field>
                            <v-text-field v-on:keyup.enter="login" v-model="login_data.password" label="Password" outlined :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                            <div class="valerror text-center">{{waitingApproval}}</div>
                            <div class="valerror text-center">{{loginValidation}}</div>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <div v-if="registration">
                            <v-btn v-on:click="register" class="pl-12 pr-12 mb-5 primary red accent-4" :loading="registerLoading"> Register</v-btn>            
                        </div>
                        <div v-else>
                            <v-btn v-on:click="login" class="pl-12 pr-12 mb-5 primary red accent-4" :loading="loginLoading"> Login </v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
                <div v-if="registrationSuccess == true" class="mt-12 pt-12 regsuccess">
                    <h1>Account Successfully Created!</h1>
                    <div class="mt-5">
                        <h2>Dear {{register_data.first_name}},</h2> 
                    </div>
                    <div class="mt-5">
                        <p> <span class="ml-5">Please wait for the approval of your request.</span>
                        It might take <br> 1-2 days to verify your account. <br> <br>
                        This is to guarantee that all users are verified first.
                        </p>
                    </div>
                    <div class="mt-5">
                        Thank you,
                         <h4>Administrator</h4>
                    </div>
                    <div>
                        <v-btn class="pl-12 pr-12 mt-10" v-on:click="returnIndex" :loading="returnLoading"> Home </v-btn>
                    </div>
                </div>
            </v-flex>
        </v-layout>
        </v-card>

        <!-- change for waiting approval -->
     
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
.valsuccess{
    color: green;
}
.regsuccess{
    color: white;
}
ul{ 
    list-style-type: none; 
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
            registerValidationContent:[],
            loginValidation:'',
            registrationSuccess:false,
            waitingApproval:'',
            loginLoading:false,
            registerLoading:false,
            returnLoading:false
        }
    },
    methods:{
        register(){
            this.registerLoading = true
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/register',{
                    first_name: this.register_data.first_name,
                    last_name: this.register_data.surname,
                    email: this.register_data.email,
                    password: this.register_data.password,
                    password_confirmation:this.register_data.password,
                    user_type_id: 2
                }).then(response => {
                    //show pending for approval
                    this.registrationSuccess = true
                    //auto login when registred successfully  this.$router.push({ name: 'User' })
                }).catch(error => {
                    this.registerLoading = false
                    // final solution in the validation
                    let valErr = Object.values(error.response.data.errors)
                    valErr = valErr.flat()
                    this.registerValidationContent = valErr
                    // if(error.response.status == 422){
                    //     console.log('422')
                    //     console.log(error.response.data.errors)
                    // }else{
                    //     console.log('not 422')
                    // }
                })
            }).catch(err => {
                this.registerLoading = false
                console.log('sanctum error')
            })
        },
        login(){
            this.loginLoading = true
            axios.get('/sanctum/csrf-cookie').then(response => {
                axios.post('/login',{
                    email: this.login_data.email,
                    password: this.login_data.password
                }).then(response => {
                    axios.get('/api/user').then(response =>{
                        let is_approved = response.data.is_approved
                        let user_type_id = response.data.user_type_id
                        if(is_approved == 1){
                            if(user_type_id == 2){
                                this.$router.push({ name: 'UserExamination' })
                            } else if(user_type_id == 1){
                                this.$router.push({ name: 'Admin' })
                            } else if(user_type_id == 3){
                                // Super Admin
                            }
                        }else{
                            this.loginLoading = false
                            this.waitingApproval = 'Waiting for approval'
                            axios.post('/logout').then(response=>{
                                //just to clear the cookies if login failed
                            })
                        }
                    })
                }).catch(err => {
                    this.loginLoading = false
                    this.loginValidation = 'The Email/Password is incorrect.'
                })
            }).catch(err => {console.log(err)})
        },
        returnIndex(){
            this.returnLoading = true
             axios.post('/logout').then(response => {
                window.location.reload()
            })
        },
    }
}
</script>