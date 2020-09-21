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

                <v-alert :value="typeof success !== 'undefined' && success != ''" transition="fade-transition" type="success">
                    {{success}}
                </v-alert>

                <v-expansion-panels class="mt-3" accordion v-for="(exam, exam_no) in exams" :key="exam.exam_id">
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3 class="colored-title">{{exam.exam_title}}</h3>
                            <span class="text-right"><b>Last update: </b>{{exam.updated_on_f}}</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>

                            <p>{{exam.exam_desc}}</p>
                            <p><b>Time Duration: </b>{{exam.time_duration}} mins</p>
                            <p><b>Passing Score: </b>{{exam.passing_score}}/{{exam.total_score}}</p>
                            <p><b>Number of questions: </b>{{exam.total_num_questions}}</p>
                            <p v-if="exam.is_randomized == true"><b>Randomized</b></p>

                            <v-container class="text-center">
                                <v-btn class="ma-2" outlined rounded color="teal darken-4" @click="viewExam(exam.exam_id)">
                                    <v-icon left>mdi-eye</v-icon> View
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="success" @click="editExamConfirm(exam.exam_id)">
                                    <v-icon left>mdi-pencil</v-icon> Edit
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="red" @click="deleteExamConfirm(exam.exam_id, exam_no)">
                                    <v-icon left>mdi-delete</v-icon> Delete
                                </v-btn>
                                <v-divider></v-divider>
                                <v-btn class="ma-2" outlined rounded color="light-blue darken-3" @click="manageExaminees(exam.exam_id, exam.exam_title)">
                                    <v-icon left>mdi-account-group</v-icon> Manage Examinees
                                </v-btn>
                                <v-btn class="ma-2" outlined rounded color="deep-orange darken-1" @click="viewResults(exam.exam_id, exam.exam_title)">
                                    <v-icon left>mdi-folder-account</v-icon> View Results
                                </v-btn>
                            </v-container>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

            </v-flex>

            <v-container>
                <v-dialog v-model="delExamDialog.show" persistent max-width="290">
                    <v-card class="pop">
                        <v-card-title class="pop"><h3>Delete Exam</h3></v-card-title>
                        <v-card-text>{{delExamDialog.message}}</v-card-text>
                        <v-card-text>All the examinees' records of taking or taken the exam will also be deleted.</v-card-text>
                        <v-card-text>Are you sure to delete the exam?</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="delExamDialog.show = false">No</v-btn>
                        <v-btn color="primary" text @click="deleteExam()">Yes, continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="editExamDialog.show" persistent max-width="290">
                    <v-card class="pop">
                        <v-card-title class="pop"><h3>Edit Exam</h3></v-card-title>
                        <v-card-text>{{editExamDialog.message}}</v-card-text>
                        <v-card-text>All the examinees already taken the exam will not be updated.</v-card-text>
                        <v-card-text>Are you sure to edit the exam?</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="editExamDialog.show = false">No</v-btn>
                        <v-btn color="primary" text @click="editExam()">Yes, continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
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
    props: {
        success: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            exams: [],
            message: '',
            delExamDialog: {
                show: false,
                message: '',
                exam_id: '',
                exam_no: 0
            },
            editExamDialog: {
                show: false,
                message: '',
                exam_id: 0
            }
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
        },
        deleteExamConfirm(exam_id, exam_no) {

            axios.post('/api/exam/examinees/count', {
                exam_id: exam_id
            }).then((response) => {

                this.delExamDialog.exam_id = exam_id
                this.delExamDialog.exam_no = exam_no
                this.delExamDialog.message = response.data.message
                this.delExamDialog.show = true

            }).catch((error) => {
                console.log('Call the Administrator')
            })
        },
        deleteExam() {
            axios.post('/api/exam/delete', {
                exam_id: this.delExamDialog.exam_id
            }).then((response) => {
                
                this.exams.splice(this.delExamDialog.exam_no, 1)
                this.delExamDialog.show = false

                this.success = 'The exam is successfully deleted.'

            }).catch((error) => {
                console.log('Call the Administrator')
            })
        },
        editExamConfirm(exam_id) {

            axios.post('/api/exam/examinees/count', {
                exam_id: exam_id
            }).then((response) => {

                this.editExamDialog.exam_id = exam_id
                this.editExamDialog.message = response.data.message
                this.editExamDialog.show = true

            }).catch((error) => {
                console.log('Call the Administrator')
            })
        },
        editExam() {
            this.$router.push({ 
                name: 'AdminEditExam', 
                params: {
                    'exam_id': this.editExamDialog.exam_id
                }
            })
        },
        viewExam(exam_id) {
            this.$router.push({ 
                name: 'AdminViewExam', 
                params: {
                    'exam_id': exam_id
                }
            })
        }
    }
}
</script>