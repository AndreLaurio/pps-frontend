<template>
    <div class="pop ml-12 mt-12">
        <v-layout row wrap>
            <v-flex>
                <h2>Examinations</h2>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="ml-12 mt-5">
            <v-flex>
                <v-text-field prepend-inner-icon="mdi-magnify" rounded solo label="Search Exam"></v-text-field>
            </v-flex>
            <v-flex class="ml-12">
                <v-btn color="#760D11" dark rounded v-on:click="createExamination"> <v-icon size="17" class="pr-1">mdi-plus-thick</v-icon> Create Exam </v-btn>    
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-5">
            <v-flex xs12 sm12 md10 xl7>

                <v-expansion-panels class="mt-3" accordion v-for="exam in exams" :key="exam.exam_id">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3 class="colored-title">{{exam.exam_title}}</h3>
                            <span><b>Last update: </b>{{exam.updated_on_f}}</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>

                            <p>{{exam.exam_desc}}</p>
                            <p><b>Time Duration: </b>{{exam.time_duration}} mins</p>
                            <p><b>Passing Score: </b>{{exam.passing_score}}/{{exam.total_score}}</p>
                            <p><b>Number of questions: </b>{{exam.total_num_questions}}</p>
                            <p v-if="exam.is_randomized == true"><b>Randomized</b></p>

                            <v-container class="text-center">
                                <v-btn class="ma-2" outlined rounded color="grey">
                                    <v-icon left>mdi-visibility</v-icon> View
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="success">
                                    <v-icon left>mdi-pencil</v-icon> Edit
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="red">
                                    <v-icon left>mdi-pencil</v-icon> Delete
                                </v-btn>
                                <v-divider></v-divider>
                                <v-btn class="ma-2" outlined rounded color="red" @click="manageExaminees(exam.exam_id, exam.exam_title)">
                                    <v-icon left>mdi-pencil</v-icon> Manage Examinees
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="red" @click="viewResults(exam.exam_id, exam.exam_title)">
                                    <v-icon left>mdi-pencil</v-icon> View Results
                                </v-btn>
                            </v-container>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

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
.colored-title {
    color: #760D11;
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
    data() {
        return {
            exams: [],
            message: ''
        }
    },
    mounted() {
        this.loadExams()
    },
    methods:{
        createExamination(){
            this.$router.push({ name: 'AdminCreateExamination' })
        },
        loadExams() {
            axios.get('/api/exams').then((response) => {
                this.exams = response.data
                this.message = 'success'
            }).catch((error) => {
                this.message = 'error'
            })
        },
        manageExaminees(exam_id, exam_title) {
            this.$router.push({ 
                name: 'AdminManageExaminees', 
                params: {
                    'exam_id': exam_id,
                    'exam_title': exam_title
                }
            })
        },
        viewResults(exam_id, exam_title) {
            this.$router.push({ 
                name: 'AdminViewResults', 
                params: {
                    'exam_id': exam_id,
                    'exam_title': exam_title
                }
            })
        }
    }
}
</script>