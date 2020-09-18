<template>
    <div class="pop mt-5 ml-12">
        <h2 class="mb-7">Examination</h2>
            <div class="text-center mr-12">
                <v-progress-circular v-if="loading == true"
                    :rotate="90"
                    :size="100"
                    :width="15"
                    :value="value"
                    color="red"
                    >
                    {{ value }}
                </v-progress-circular>
            </div>
        <v-layout>
            <v-flex>
                <v-row>
                    <v-card v-for="exam in exams" :key="exam.exam_id" max-width="300" class="ml-5 mt-5">
                        <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="300px"></v-img>
                        <v-card-title>
                            {{exam.exam_title}}
                        </v-card-title>
                        <v-card-text>
                            {{exam.exam_desc}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="primary red accent-4" v-on:click="takeExam(exam.exam_id)">Take Exam</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-row>
            </v-flex>

            <v-row justify="center">
                <v-dialog v-model="dialog.show" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">{{dialog.title}}</v-card-title>
                        <v-card-text>{{dialog.message}}</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="dialog.show = false">Got it</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-layout>
        
        <v-main>
            <UserDashboard/>
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
import UserDashboard from '@/components/user/UserDashboard'
import axios from 'axios'
 
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    data(){
        return{
            user_id: '',
            exams: [],
            message: 'sample',
            loading:true,
            interval: {},
            value: 0,
            dialog: {
                show: false,
                title: ''
            }
        }
    },
    components:{
        UserDashboard
    },
    mounted() {
        this.getUserID(),
        this.loadExams()
        this.loadingButton()
    },
     // for loading button
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods:{
        getUserID(){
            axios.get('/api/user').then(response =>{
                this.user_id = response.data.user_id
            })
        },
        loadExams() {
            axios.get('/api/exams').then((response) => {
                this.exams = response.data
                this.loading = false
            }).catch((error) => {
                console.log('Please call the adminsitrator')
            })
        },
        takeExam(exam_id) {
            axios.post('/api/exam/take/intro', {
                user_id: this.user_id,
                exam_id: exam_id
            }).then((response) => {

                if (response.data.status == 'success') {
                    this.$router.push({ name: 'UserTakeExam' })
                }
                else if (response.data.status == 'error') {

                    this.dialog.title = 'Examination Dialog'
                    this.dialog.message = response.data.message
                    this.dialog.show = true
                }
                
            }).catch((error) => {
                console.log('Call the Administrator')
            });
        },
        loadingButton(){
            this.interval = setInterval(() => {
                if (this.value === 100) {
                    return (this.value = 0)
                }
                this.value += 10
            }, 1000)
        },

    }
}
</script>