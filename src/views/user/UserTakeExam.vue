<template>
    <div class="pop mt-12 ml-12">
        <!-- <h2 class="mb-12">Take </h2> -->
        <v-container>
            <v-card class="mx-auto" max-width="344" outlined v-if="is_taking_exam == false">
                <v-list-item two-line>
                    
                    <v-list-item-content>
                        <v-list-item-title class="headline mb-1">{{exam.exam_title}}</v-list-item-title>
                        <v-list-item-subtitle>
                            <p>{{exam.exam_desc}}</p>
                            <p><b>Time Duration: </b>{{exam.time_duration}} mins</p>
                            <p><b>Passing Score: </b>{{exam.passing_score}}/{{exam.total_score}}</p>
                            <p><b>Number of questions: </b>{{exam.total_num_questions}}</p>
                        </v-list-item-subtitle>
                    </v-list-item-content>

                </v-list-item>

                <v-card-actions>
                    <v-btn right v-on:click="takeExam">Take Exam</v-btn>
                </v-card-actions>
            </v-card>


            <p>{{message}}</p>

            <v-container v-if="is_taking_exam == true">

                <v-card-text class="pl-12 pr-12">
                    <v-card v-for="(item, item_no) in exam.exam_items" :key="item.item_no" class="pa-4 mb-4">

                        <div>
                            <v-row>
                                <v-col>
                                    <span>{{item.item_no+1}}</span>
                                </v-col>
                                <v-col>
                                    <p>{{item.text}}</p>
                                </v-col>
                            </v-row>
                        </div>
                        
                        <div v-if="item.question_type_code == 'SCQ'">
                            <v-radio-group v-model="item.answer" :mandatory="false">
                                <v-radio v-for="choice in item.choices" :key="choice.choice_no" :value="choice.choice_no" :label="choice.label"></v-radio>
                            </v-radio-group>
                        </div>


                        <div v-if="item.question_type_code == 'MCQ'">
                            <p>Please select only {{item.mcq_max_selection}} choices.</p>
                            <div v-for="choice in item.choices" :key="choice.choice_no">
                                <v-checkbox
                                    :label="choice.label"
                                    v-model="choice.is_selected"
                                    v-on:change="checkMCQAnswer(item, choice)"

                                    hide-details>
                                </v-checkbox>
                            </div>
                        </div>

                        <div v-if="item.question_type_code == 'FTQ'">
                            <v-textarea v-model="item.answer" :counter="200" outlined placeholder="Please write your answer." :rows="3" />
                        </div>

                        <div>
                            <p :id="`m-${item_no}`">{{exam.exam_items[item_no].message}}</p>
                        </div>

                    </v-card>
                </v-card-text>

                <v-row justify="center">
                    <v-dialog v-model="submitAnswerDialog" persistent max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on">
                            Submit Answer
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Submit You Answer</v-card-title>
                            <v-card-text></v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="submitAnswerDialog = false">No</v-btn>
                            <v-btn color="green darken-1" text @click="submitAnswer">Yes, continue</v-btn>
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
            answer: 0
        }
    },
    components:{
        UserDashboard
    },
    mounted() {
        this.loadData()
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
            }).catch((error) => {
                this.message = 'error'
                console.log(error.response.data.errors)
            })
        },
        takeExam() {

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
        test() {
            
            this.message = 'test'
            console.log(this.exam)
        }
    }
}
</script>