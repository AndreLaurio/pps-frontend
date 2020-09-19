<template>
    <div class="pop ml-12 mt-12">
        <h2 class="mt-12 ml-12">View Results</h2>
        <p class="ml-12">{{exam_title}}</p>
        <v-layout justify-center>
            <v-flex xs12 sm12 xl10 md10>
                <div class="mt-6">
                    
                    <v-data-table
                        :headers="headers"
                        :items="examinees"
                        class="elevation-1"
                    >
                        <template v-slot:item="examinee">
                            <tr>
                                <td>
                                    {{examinee.item.last_name}}
                                </td>
                                 <td>
                                    {{examinee.item.first_name}}
                                </td>
                                <td class="text-center">
                                    {{examinee.item.email}}
                                </td>
                                <td class="text-right">
                                    {{examinee.item.overall_score}}/{{examinee.item.total_score}}
                                </td>
                                
                                <td class="text-center">
                                    {{examinee.item.exam_remarks}}
                                </td>
                                <td class="text-center">
                                    <v-btn class="mx-2 blue" small @click="viewAnswer(examinee.item.user_id)"><v-icon>mdi-eye</v-icon> View Answer</v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
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
    props: {
        exam_id: {
            type: Number,
            default: 0
        },
        exam_title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            examinees: [],
            headers:[
                {text: 'Surname'},
                {text: 'First Name'},
                {text: 'Email', align:'center'},
                {text: 'Score', align:'center'},
                {text: 'Remarks', align:'center'},
                {text: 'Actions', align: 'center'}
            ]
        }
    },
    mounted() {
        this.getExamExaminees()
    },
    methods:{
        getExamExaminees() {
            if (this.exam_id == 0) {
                this.$router.push({ name: 'AdminExamination' })
            }
            else {
                axios.post('/api/exam/results', {
                    exam_id: this.exam_id
                }).then((response) => {

                    this.examinees = response.data

                }).catch((error) => {
                    console.log('Please call the Administrator.')
                })
            }
        },
        viewAnswer(user_id) {
            console.log('View Answer')
        }
    }
}
</script>