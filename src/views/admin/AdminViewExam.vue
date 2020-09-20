<template>
    <div class="pop mt-12 ml-12">
        <v-container>
            <v-card class="mx-auto rounded-xl card-border" elevation="15" max-width="800" outlined>
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
                    <br>
                </v-card-text>
            </v-card>

            <v-spacer></v-spacer>
            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <v-container>

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
                    <v-btn
                        class="primary red accent-4"
                        dark
                        @click="back()">
                        Back
                    </v-btn>
                </v-row>

            </v-container>
        </v-container>
        
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
.exam-warning{
    color: #760D11;
}
.card-border{
    border: 4px solid #760D11;
}
</style>

<script>
import AdminDashboard from '@/components/admin/AdminDashboard'
import axios from 'axios'
 
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

export default {
    data(){
        return{
            exam: [],
            loading:true,
            interval: {},
            value: 0,
        }
    },
    props: {
        exam_id: {
            type: Number,
            default: 0
        }
    },
    components:{
        AdminDashboard
    },
    mounted() {
        this.loadData()
    },
     // for loading button
    beforeDestroy () {
        clearInterval(this.interval)
    },
    methods:{
        loadData(){
            if (this.exam_id == 0) {
                this.$router.push({ name: 'AdminExamination' })
            }
            else {
                axios.get(`/api/exam/${this.exam_id}`).then((response) =>{
                    this.exam = response.data
                    this.loading = false
                }).catch((error) => {
                    console.log('Call the Administrator.')
                })
            }
        },
        back() {
            this.$router.push({ name: 'AdminExamination' })
        }
    }
}
</script>