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
                    <v-card v-for="item in exam.exam_items" :key="item.item_no" class="pa-4 mb-4">

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
                            <v-radio-group v-model="answers[item.item_no]" :mandatory="false">
                                <v-radio v-for="choice in item.choices" :key="choice.choice_no" :value="choice.choice_no" :label="choice.label"></v-radio>
                            </v-radio-group>
                        </div>


                        <div v-if="item.question_type_code == 'MCQ'">
                            <div v-for="choice in item.choices" :key="choice.choice_no">
                                <v-checkbox
                                    :label="choice.label"
                                    :value="choice.choice_no"
                                    v-model="answers[item.item_no]"
                                    v-on:change="test"
                                    hide-details>
                                </v-checkbox>
                            </div>
                        </div>

                    </v-card>
                </v-card-text>

                <v-btn v-on:click="test">Test</v-btn>

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
                        this.message = 'You already taking this exam.'
                    }
                }
                else {
                    this.message = 'Please choose an exam to take.'
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        getExamDesc(exam_id) {
            axios.get(`/api/exam/desc/${exam_id}`).then((response) => {
                this.exam = response.data
            }).catch((error) => {
                this.message = 'error'
            })
        },
        takeExam() {
            axios.get(`/api/exam/items/${this.exam.exam_id}`).then((response) => {
                this.exam.exam_items = response.data.exam_items
                this.exam.exam_groups = response.data.exam_groups
                
                this.is_taking_exam = true
                this.message = 'takeExam success'
            }).catch((error) => {
                this.message = 'error'
            })
        },
        toLetter(index) {
            return String.fromCharCode(index + 'A'.charCodeAt(0))
        },
        checkMCQAnswer(item_no, choice_no, mcq_max_selection) {

            if (this.exam.exam_items[item_no].hasOwnProperty('count_selected') == false) {
                this.exam.exam_items[item_no].count_selected = 0
            }

            let count_selected = this.exam.exam_items[item_no].count_selected;
            let is_selected = this.exam.exam_items[item_no].choices[choice_no].is_selected;

            if (is_selected == 1) {
                
                if (count_selected + 1 <= mcq_max_selection) {
                    this.exam.exam_items[item_no].count_selected = count_selected + 1
                }
                else {
                    this.exam.exam_items[item_no].choices[choice_no].is_selected = 0 
                }
            }
            else {
                this.exam.exam_items[item_no].count_selected = count_selected - 1
            }

            console.log(this.exam.exam_items[item_no])
            console.log(this.exam.exam_items[item_no].count_selected)

            this.message = mcq_max_selection
        },

        test() {
            
            this.message = 'test'
            console.log(this.answers)
        }
    }
}
</script>