<template>
    <div class="pop mt-12 ml-12">
        <h2 class="mb-12">Examination</h2>
        <v-layout>
            <v-flex v-for="exam in exams" :key="exam.exam_id">
                <v-card max-width="300">
                    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" width="300px"></v-img>
                    <v-card-title>
                        {{exam.exam_title}}
                    </v-card-title>
                    <v-card-text>
                        {{exam.exam_desc}}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary" v-on:click="takeExam(exam.exam_id)">Take</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>

            <p>{{message}}</p>
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
            message: 'sample'
        }
    },
    components:{
        UserDashboard
    },
    mounted() {
        this.getUserID(),
        this.loadExams()
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
                this.message = 'success'
            }).catch((error) => {
                this.message = 'error'
            })
        },
        takeExam(exam_id) {
            axios.post('/api/exam/take/intro', {
                user_id: this.user_id,
                exam_id: exam_id
            }).then((response) => {
                this.message = 'success'
                console.log({
                user_id: this.user_id,
                exam_id: exam_id
                });
                this.$router.push({ name: 'UserTakeExam' })
            }).catch((error) => {
                this.message = error.response.data.message
            });
        }

    }
}
</script>