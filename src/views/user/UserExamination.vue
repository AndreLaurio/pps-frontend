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
        <v-layout v-if="result.show == false">
            <v-flex>
                <v-row>
                    <v-card v-for="exam in exams" :key="exam.exam_id" max-width="300" class="ml-5 mt-5">
                        <v-card-title class="colored-title">
                            {{exam.exam_title}}
                        </v-card-title>
                        <v-card-text>
                            {{exam.exam_desc}}

                            <v-spacer></v-spacer>
                            <p v-if="exam.exam_status_code == 'F'" color="error">Finished</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn v-if="exam.exam_status_code == 'N'" class="primary red accent-4" v-on:click="takeExam(exam.exam_id)">Take Exam</v-btn>
                            <v-btn v-if="exam.exam_status_code == 'O'" class="primary red accent-4" v-on:click="takeExam(exam.exam_id)">Continue Exam</v-btn>
                            <v-btn v-if="exam.exam_status_code == 'F'" class="primary red accent-4" @click="viewResult(exam.exam_id)">View Result</v-btn>
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

        <v-layout v-if="result.show == true">
            <v-card class="mx-auto rounded-xl card-border" elevation="15" max-width="800" outlined>
                <v-card-title class="mt-5 pl-12">
                    <h3 class="pop exam-warning">Exam Result</h3>
                </v-card-title>
                <v-card-text class="pl-12 mr-5">
                    
                        <div class="exam-warning">
                            <b>Examinee no: </b>{{result.examinee_no}}<br>
                            <b>Score: </b>{{result.overall_score}}/{{result.total_score}} <br>
                            <p>Wait for admin@gmail.com to message you for interview for details.</p>
                        </div>
                </v-card-text>
                <v-card-actions class="mr-5 mb-5">
                    <v-spacer></v-spacer>
                    <v-btn class="primary accent-4" v-on:click="result.show = false">Back</v-btn>
                    <v-btn class="primary red accent-4" v-on:click="printExam">Print</v-btn>
                </v-card-actions>
            </v-card>
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
.colored-title {
    color: #760D11;
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
            },
            result: {
                show: false,
                examinee_no: '',
                overall_score: 0,
                total_score: 0
            }
        }
    },
    components:{
        UserDashboard
    },
    mounted() {
        this.load(),
        this.loadingButton()
    },
     // for loading button
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods:{
        load() {
            axios.get('/api/user').then(response =>{
                this.user_id = response.data.user_id
                this.loadExams()
            })
        },
        loadExams() {
            axios.post('/api/examinee/exams', {
                user_id: this.user_id
            }).then((response) => {
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
        viewResult(exam_id) {
            
            axios.post('/api/examinee/exam/result', {
                user_id: this.user_id,
                exam_id: exam_id
            }).then((response) => {
                
                if (response.data.status == 'success') {
                    this.result.examinee_no = response.data.examinee_no
                    this.result.overall_score = response.data.overall_score
                    this.result.total_score = response.data.total_score

                    this.result.show = true
                }
                
            }).catch((error) => {
                console.log('Call the Administrator')
            });
        },
        printExam() {
            console.log('print')
        }
    }
}
</script>