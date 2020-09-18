<template>
    <div class="pop mt-12 ml-12">
        <!-- <h2 class="mb-12">Take </h2> -->
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
        <v-container>
            <v-card class="mx-auto rounded-xl card-border" elevation="15" max-width="800" outlined v-if="is_taking_exam == false && loading == false">
                <v-card-title class="mt-5 pl-12">
                    <h3 class="pop exam-warning">{{exam.exam_title}}</h3>
                </v-card-title>
                <v-card-text class="pl-12 mr-5">
                    <h3>{{exam.exam_desc}}</h3> <br>
                        <div class="exam-warning">
                            <b>Time Duration: </b>{{exam.time_duration}} mins <br>
                            <b>Passing Score: </b>{{exam.passing_score}}/{{exam.total_score}} <br>
                            <b>Number of questions: </b>{{exam.total_num_questions}} <br>
                        </div>
                </v-card-text>
                <v-card-actions class="mr-5 mb-5">
                    <v-spacer></v-spacer>
                    <v-btn class="primary red accent-4" v-on:click="takeExam" :loading="loadingTake">Take Exam</v-btn>
                </v-card-actions>
            </v-card>
            

            <p>{{message}}</p>

            <v-container v-if="is_taking_exam == true">

                <h2 class="pop exam-warning">{{exam.exam_title}}</h2>

                <v-card-text class="pl-12 pr-12">
                    <v-card elevation="15" v-for="(item, item_no) in exam.exam_items" :key="item.item_no" class="pa-4 mb-4 rounded-xl">

                        <div class="ml-5">
                            <v-row>
                                <v-col>
                                    <span style="display:inline" class="exam-warning mr-1"> {{item.item_no+1}}.</span> 
                                    <span style="display:inline">{{item.text}}</span>
                                </v-col>
                            </v-row>
                        </div>
                        
                        <div v-if="item.question_type_code == 'SCQ'" class="ml-10">
                            <v-radio-group v-model="item.answer" :mandatory="false">
                                <v-radio color="red darken-3" v-for="choice in item.choices" :key="choice.choice_no" :value="choice.choice_no" :label="choice.label"></v-radio>
                            </v-radio-group>
                        </div>


                        <div v-if="item.question_type_code == 'MCQ'" class="ml-10">
                            <p>Please select only {{item.mcq_max_selection}} choices.</p>
                            <div v-for="choice in item.choices" :key="choice.choice_no">
                                <v-checkbox
                                    :label="choice.label"
                                    v-model="choice.is_selected"
                                    v-on:change="checkMCQAnswer(item, choice)"
                                    color="red darken-3"
                                    hide-details>
                                </v-checkbox>
                            </div>
                        </div>

                        <div v-if="item.question_type_code == 'FTQ'" class="ml-10">
                            <v-textarea v-model="item.answer" :counter="200" outlined placeholder="Please write your answer." :rows="3" />
                        </div>

                        <div>
                            <p class="exam-warning ml-10 mt-2" :id="`m-${item_no}`">{{exam.exam_items[item_no].message}}</p>
                        </div>

                    </v-card>
                </v-card-text>

                <v-row justify="center">
                    <v-dialog v-model="submitAnswerDialog" persistent max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="primary red accent-4"
                                dark
                                v-bind="attrs"
                                v-on="on">
                            Submit Answer
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Are you sure to submit your answer?</v-card-title>
                            <v-card-text></v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="submitAnswerDialog = false">No</v-btn>
                            <v-btn color="green darken-1" text @click="submitAnswer" :loading="loadingSubmit">Yes, continue</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>

            </v-container>

        </v-container>
        
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
.exam-warning{
    color: #760D11;
}
.card-border{
    border: 4px solid #760D11;
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
            submitAnswerDialog: false,
            exam_id: '',
            user_id: '',
            exam: [],
            answers: [],
            message: 'sample',
            is_taking_exam: false,
            answer: 0,
            loading:true,
            loadingTake:false,
            loadingSubmit:false,
            interval: {},
            value: 0,
        }
    },
    components:{
        UserDashboard
    },
    mounted() {
        this.loadData()
        this.loadingButton()
    },
     // for loading button
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods:{
        loadData(){
            axios.get('/api/user').then((response) =>{
                this.user_id = response.data.user_id
                this.loadExamSession()
            }).catch((error) => {
                this.message = 'error'
                console.log(error.response.data.errors)
            })
        },
        loadExamSession() {      
            axios.post('/api/exam/take/session/get', {
                    user_id: this.user_id
            }).then((response) => {
                
                if (response.data.session_exam_id != 0) {

                    if (response.data.session_taken_on == null) {
                        this.getExamDesc(response.data.session_exam_id)
                        this.message = 'success'
                    }
                    else {
                        this.getExamDesc(response.data.session_exam_id)
                        this.message = 'You already taking this exam.'
                    }
                }
                else {
                    this.message = 'Please choose an exam to take.'
                }
            }).catch((error) => {
                this.message = 'error'
                console.log(error.response.data.errors)
            })
        },
        getExamDesc(exam_id) {
            axios.get(`/api/exam/desc/${exam_id}`).then((response) => {
                this.exam = response.data
                this.loading = false
            }).catch((error) => {
                this.message = 'error'
                console.log(error.response.data.errors)
            })
        },
        takeExam() {
            this.loadingTake = true
            axios.get(`/api/exam/items/${this.exam.exam_id}`).then((response) => {
                this.exam.exam_items = response.data.exam_items
                this.exam.exam_groups = response.data.exam_groups 
                this.is_taking_exam = true
                this.message = 'takeExam success'

                axios.post('/api/exam/take/session/set', {
                    'user_id': this.user_id,
                    'exam': this.exam
                }).then((response) => {

                }).catch((error) => {

                })

            }).catch((error) => {
                this.message = 'error'
                console.log(error.response.data.errors)
            })
        },
        toLetter(index) {
            return String.fromCharCode(index + 'A'.charCodeAt(0))
        },
        checkMCQAnswer(item, choice) {
            
            if (item.hasOwnProperty('count_selected') == false) {
                item.count_selected = 0
            }

            if (choice.is_selected == true) {
                item.count_selected++
            }
            else {
                item.count_selected--
            }

            if (item.count_selected > item.mcq_max_selection) {

                document.getElementById('m-' + item.item_no).innerHTML = "You can only choose " + item.mcq_max_selection + " options."
            }
            else {
                document.getElementById('m-' + item.item_no).innerHTML = ""
            }
        },
        submitAnswer() {
            this.loadingSubmit = true
            axios.post('/api/exam/check', {
                'exam': this.exam,
                'user_id': this.user_id
            }).then((response) => {
                this.message = "success"
                this.submitAnswerDialog = false
            }).catch((error) => {
                this.messsage = "error"
                this.submitAnswerDialog = false
            })
        },
        loadingButton(){
            this.interval = setInterval(() => {
                if (this.value === 100) {
                    return (this.value = 0)
                }
                this.value += 10
            }, 1000)
        },
        test() {
            
            this.message = 'test'
            console.log(this.exam)
        }
    }
}
</script>