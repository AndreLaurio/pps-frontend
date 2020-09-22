<template>
    <div class="pop mt-5 ml-12">
        <h2 class="mb-12">Profile</h2>
        <v-layout justify-center>
            <v-flex xs12 sm12 md3 xl3>
                <v-card flat tile class="d-flex">
                    <v-img
                        :src="photo.src"
                        aspect-ratio="1"
                        class="grey lighten-2"
                    >
                    </v-img>
              </v-card>

                <input type="file" @change="previewImage" :model="photo.img" label="File input"  prepend-icon="mdi-camera" outlined dense></v-file-input>
                <p>{{photo.message}}</p>
                <v-btn class="primary red accent-4 mr-5 mb-5" v-on:click="changePhoto">Change Photo</v-btn>
            </v-flex>
            <v-flex xs12 sm12 md8 xl6>
                <v-card class="rounded-xl" max-width="700" elevation="5">
                    <v-card-text>
                        <v-layout>
                            <span class="ml-5 mt-5">Details</span> 

                        </v-layout>
                    </v-card-text>
                    <v-card-text class="ml-12">
                        <v-layout>
                            <v-flex>
                                First Name<v-text-field solo dense v-model="user_details.first_name"></v-text-field>
                                Middle Name<v-text-field solo dense v-model="user_details.middle_name"></v-text-field>
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="user_details.birth_date"
                                        label="Birthday date"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker
                                    ref="picker"
                                    v-model="user_details.birth_date"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    min="1950-01-01"
                                    @change="save"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex>
                                Last Name<v-text-field solo dense v-model="user_details.last_name"></v-text-field>
                                Extension Name<v-text-field solo dense v-model="user_details.extension_name"></v-text-field>
                                Sex<v-select solo dense :items="sex" v-model="user_details.sex"></v-select>
                            </v-flex>
                        </v-layout>
                        <div>
                            <v-btn class="primary red accent-4 mr-5 mb-5" v-on:click="changeDetails">Change Details</v-btn>
                        </div>
                    </v-card-text>
                </v-card>

                 <v-card class="rounded-xl mt-12" max-width="700" elevation="5">
                    <v-card-title>
                        <span class="ml-5 mt-5">Change Password</span>
                    </v-card-title>
                    <v-card-text class="ml-12">
                        <v-layout>
                            <v-flex>
                                Email<v-text-field dense solo v-model="user_password.email"  :rules="emailRules" :counter="30" required></v-text-field>
                            </v-flex>
                            <v-flex>
                                Password<v-text-field dense solo v-model="user_password.password" :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'" :type="show_password ? 'text' : 'password'" @click:append="show_password = !show_password" required></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex>
                                Confirm Password<v-text-field dense solo v-model="user_password.confirm_password" :rules="[rules.required, rules.min]" counter hint="At least 8 characters" :append-icon="confirmation_password ? 'mdi-eye' : 'mdi-eye-off'" :type="confirmation_password ? 'text' : 'password'" @click:append="confirmation_password = !confirmation_password" required></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-btn class="primary mt-6 red accent-4" v-on:click="changePassword">Change Password</v-btn>
                            </v-flex>
                        </v-layout>
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
.v-text-field{
    width: 250px;
}
</style>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    data(){
        return{
            sex: ['Female', 'Male'],
            user_id:'',
            user_email:'',
            user_password:'',
            menu: false,
            emailRules:[
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            user_details:{
                first_name:'',
                middle_name:'',
                last_name:'',
                extension_name:'',
                birth_date:'',
                sex:''
            },
            user_password:{
                email:'',
                password:'',
                confirm_password:''
            },
            show_password: false,
            confirmation_password:false,

            photo: {
                img: '',
                src: '',
                message: ''
            }
        }
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
    mounted(){
        this.getUserData()
    },
    methods:{
        getUserData(){
            axios.get('/api/user').then(response =>{
                this.user_id = response.data.user_id
                this.user_email = response.data.email
            })
        },
        changeDetails(){
            let user_id = this.user_id
            axios.put(`/api/changedetails/${user_id}`,{
                first_name: this.user_details.first_name,
                middle_name: this.user_details.middle_name,
                last_name: this.user_details.last_name,
                extension_name: this.user_details.extension_name,
                birth_date: this.user_details.birth_date,
                gender: this.user_details.gender
            }).then(response => {
                console.log('success')
            }).catch(error => {
                console.log('error')
            })
        },
        changePassword(){
            //check the email for authentication
            let current_email = this.user_email
            if(this.user_password.email != this.user_email){
                console.log('Email incorrect')
            }else if(this.user_password.password == this.user_password.confirm_password){
                //get the user id
                let user_id = this.user_id
                axios.put(`/api/changepw/${user_id}`,{
                    new_password: this.user_password.password
                })
            }else{
                console.log('password incorrect')
            }
        },
        save (date) {
            this.$refs.menu.save(date)
        },
        changePhoto() {
            
            if (this.photo.img == '') {
                this.photo.message = 'Please select a photo.'
                return
            }
            if (this.photo.img['type'] !=='image/jpeg' && this.photo.img['type'] !=='image/png') {
                this.photo.message = 'Please select a photo.'
                return
            }

            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }

            let formData = new FormData()
            formData.append('photo_img', this.photo.img)
            formData.append('user_id', this.user_id)

            axios.post(
                `/api/changephoto/${this.user_id}`, formData, config
            ).then((response) => {
                this.photo.message = 'The photo changed successfully.'
            }).catch((error) => {
                console.log('Please contat the Administrator.')
            })
        },
        previewImage(e) {
            var files = e.target.files

            if (files.length != 1) {
                this.photo.src = ''
                this.photo.message = 'Please select a photo.'
            }
            else if (files[0]['type']==='image/jpeg' || files[0]['type']==='image/png') {
                const file = e.target.files[0]
                this.photo.src = URL.createObjectURL(file)
                this.photo.img = e.target.files[0]
                this.photo.message = ''
            }
            else {
                this.photo.src = ''
                this.photo.message = 'Please select a photo.'
            }
        }
    }
}
</script>