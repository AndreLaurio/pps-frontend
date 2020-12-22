<template>
    <div class="pop ml-12 mt-12">
        <h2 class="mt-12 ml-12">View Results</h2>
        <p class="ml-12">{{exam_title}}</p>
        <v-layout justify-center>
            <v-flex xs12 sm12 xl10 md10>
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
                <div class="mt-6">
                    
                    <v-data-table
                        v-if="loading == false"
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
                                    <span v-if="examinee.item.exam_status_code == 'N'">NO ANSWER</span>
                                    <v-btn v-if="examinee.item.exam_status_code != 'N'" class="mx-2 primary" small @click="viewAnswer(examinee.item.user_id)"><v-icon>mdi-eye</v-icon> View Answer</v-btn>
                                </td>
                                <td class="text-center">
                                    <v-btn v-if="examinee.item.exam_status_code != 'N'" class="mx-2 default" small @click="viewChangeTabHistory(examinee.item.user_id, examinee.item.exam_id)"><v-icon>mdi-eye</v-icon> Count: {{examinee.item.change_tab_count}}</v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>

                    <v-dialog v-model="changeTabHistoryDialog" persistent max-width="550">
                        <v-card class="font-body">
                            <v-card-title class="pl-8 pr-8 pt-8 justify-center">
                                <span class="text-center text-uppercase register-title"
                                    >Change Tab Hisory</span
                                >
                            </v-card-title>
                            <v-card-text>
                                
                                <v-data-table
                                    :headers="changeTabHistoryHeaders"
                                    :items="changeTabs"
                                    class="elevation-1"
                                >
                                    <template v-slot:item="changeTab">
                                        <tr>
                                            <td>
                                                <center>{{changeTab.item.change_tab_date}}</center>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                                

                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                               
                                <v-btn
                                    color="red darken-1"
                                    text
                                    @click="changeTabHistoryDialog = false"
                                    class="text-uppercase"
                                >
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
            loading:true,
            interval: {},
            value: 0,
            headers:[
                {text: 'Surname'},
                {text: 'First Name'},
                {text: 'Email', align:'center'},
                {text: 'Score', align:'center'},
                {text: 'Remarks', align:'center'},
                {text: 'Actions', align: 'center'},
                {text: 'Change Tab', align: 'center'}
            ],
            changeTabHistoryDialog: false,
            changeTabs: [],
            changeTabHistoryHeaders:[
                {text: 'Date', align:'center'}
            ],
        }
    },
    mounted() {
        this.getExamExaminees()
        this.loadingButton()
    },
    beforeDestroy () {
        clearInterval(this.interval)
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
                    this.loading = false
                    this.examinees = response.data

                // }).catch((error) => {
                    console.log('Please call the Administrator.')
                })
            }
        },
        viewAnswer(user_id) {
            this.$router.push({ 
                name: 'AdminViewAnswer',
                params: {
                    exam_id: this.exam_id,
                    exam_title: this.exam_title,
                    user_id: user_id
                }
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
        viewChangeTabHistory(user_id, exam_id) {
            console.log('clicked');
            axios.post('/api/exam/examinee/change-tab-history/get', {
                user_id: user_id,
                exam_id: exam_id
            }).then((response) => {
                
                this.changeTabs = response.data;
                this.changeTabHistoryDialog = true;
                console.log('succ');

            }).catch((error) => {
                console.log('Please contact the Administrator.');
                console.log('faliled');
            })
        }
    }
}
</script>